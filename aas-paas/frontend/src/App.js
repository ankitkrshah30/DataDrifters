import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { identifyImage } from './services/apiService';

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('upload');
    const [cameraStream, setCameraStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);


    useEffect(() => {
    // This effect runs whenever the cameraStream or showCamera state changes.
    // It safely attaches the stream to the video element after it has rendered.
        if (showCamera && cameraStream && videoRef.current) {
            videoRef.current.srcObject = cameraStream;
            videoRef.current.play();
        }
    }, [showCamera, cameraStream]);

    // Cleanup camera stream on unmount
    useEffect(() => {
        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [cameraStream]);

    // Apply theme to body
    useEffect(() => {
        document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
    }, [isDarkMode]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setResult(null);
            setError('');
            setActiveTab('upload');
        }
    };

    const startCamera = async () => {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
    }
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment',
            } 
        });
        // This function now ONLY sets the state.
        setCameraStream(stream);
        setShowCamera(true);
        setActiveTab('camera');
        setError('');
    } catch (err) {
        console.error('Error accessing camera:', err);
        if (err.name === 'NotAllowedError') {
            setError('Camera permission was denied. Please allow camera access in your browser settings.');
        } else if (err.name === 'NotFoundError') {
            setError('No camera found on this device.');
        } else {
            setError('Unable to access camera. It might be in use by another application.');
        }
    }
};

    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
        setShowCamera(false);
        setCapturedImage(null);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
                    setSelectedFile(file);
                    setCapturedImage(URL.createObjectURL(blob));
                    stopCamera();
                }
            }, 'image/jpeg', 0.8);
        }
    };

    const handlePaste = (event) => {
        const items = event.clipboardData?.items;
        if (items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    if (file) {
                        setSelectedFile(file);
                        setResult(null);
                        setError('');
                        setActiveTab('paste');
                    }
                    break;
                }
            }
        }
    };

    useEffect(() => {
        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, []);

    const handleSubmit = async () => {
        if (!selectedFile) {
            setError('Please select an image file first.');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await identifyImage(selectedFile);
            const parsedResult = response.data;
            setResult(parsedResult);
        } catch (err) {
            console.error(err);
            setError('Failed to analyze image. The backend might be down or an error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const clearSelection = () => {
        setSelectedFile(null);
        setResult(null);
        setError('');
        setCapturedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
            {/* Theme Toggle */}
            <div className="theme-toggle">
                <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="theme-btn"
                    aria-label="Toggle theme"
                >
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
            </div>

            {/* Background Animation */}
            <div className="background-animation">
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                    <div className="shape shape-4"></div>
                    <div className="shape shape-5"></div>
                </div>
            </div>

            <header className="App-header">
                <div className="logo-container">
                    <div className="logo-icon">🛍️</div>
                    <div className="logo-text">
                        <h1>Aaas Paas AI-dentifier</h1>
                        <p className="tagline">Discover local businesses with AI-powered image analysis</p>
                    </div>
                </div>
            </header>
            
            <main className="App-main">
                {/* Input Method Tabs */}
                <div className="input-tabs">
                    <button 
                        className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upload')}
                    >
                        <span className="tab-icon">📁</span>
                        <span className="tab-text">Upload Image</span>
                    </button>
                    <button 
                        className={`tab ${activeTab === 'camera' ? 'active' : ''}`}
                        onClick={() => setActiveTab('camera')}
                    >
                        <span className="tab-icon">📷</span>
                        <span className="tab-text">Camera</span>
                    </button>
                    <button 
                        className={`tab ${activeTab === 'paste' ? 'active' : ''}`}
                        onClick={() => setActiveTab('paste')}
                    >
                        <span className="tab-icon">📋</span>
                        <span className="tab-text">Paste Image</span>
                    </button>
                </div>

                {/* Upload Section */}
                {activeTab === 'upload' && (
                    <div className="upload-section">
                        <div className="section-header">
                            <h2>📁 Upload Your Image</h2>
                            <p>Select an image file from your device</p>
                        </div>
                        <div className="file-input-container">
                            <input 
                                ref={fileInputRef}
                                id="file-input"
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileChange}
                                className="file-input"
                            />
                            <label htmlFor="file-input" className="file-input-label">
                                <div className="upload-icon">📁</div>
                                <div className="upload-text">
                                    <span className="primary-text">Choose an image file</span>
                                    <span className="secondary-text">or drag and drop here</span>
                                </div>
                            </label>
                        </div>
                    </div>
                )}

                {/* Camera Section */}
                {activeTab === 'camera' && (
                    <div className="camera-section">
                        <div className="section-header">
                            <h2>📷 Camera Capture</h2>
                            <p>Take a photo directly with your device</p>
                        </div>
                        {!showCamera ? (
                            <div className="camera-controls">
                                <button onClick={startCamera} className="camera-btn">
                                    <span className="btn-icon">📷</span>
                                    <span className="btn-text">Open Camera</span>
                                </button>
                                <p className="camera-hint">Click to start your camera and take a photo</p>
                            </div>
                        ) : (
                            <div className="camera-view">
                                <div className="camera-frame">
                                    <video 
                                        ref={videoRef} 
                                        autoPlay 
                                        playsInline 
                                        muted 
                                        className="camera-video"
                                    />
                                    <div className="camera-overlay">
                                        <div className="focus-frame"></div>
                                    </div>
                                </div>
                                <div className="camera-buttons">
                                    <button onClick={capturePhoto} className="capture-btn">
                                        <span className="btn-icon">📸</span>
                                        <span className="btn-text">Capture Photo</span>
                                    </button>
                                    <button onClick={stopCamera} className="cancel-btn">
                                        <span className="btn-icon">❌</span>
                                        <span className="btn-text">Cancel</span>
                                    </button>
                                </div>
                            </div>
                        )}
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </div>
                )}

                {/* Paste Section */}
                {activeTab === 'paste' && (
                    <div className="paste-section">
                        <div className="section-header">
                            <h2>📋 Paste from Clipboard</h2>
                            <p>Paste an image copied from anywhere</p>
                        </div>
                        <div className="paste-area">
                            <div className="paste-icon">📋</div>
                            <p className="paste-primary">Paste an image from your clipboard</p>
                            <p className="paste-hint">Use Ctrl+V (or Cmd+V on Mac) to paste</p>
                            <div className="paste-example">
                                <span>💡 Tip: Copy an image from any app and paste it here</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Selected Image Preview */}
                {selectedFile && (
                    <div className="image-preview">
                        <div className="section-header">
                            <h2>🖼️ Image Preview</h2>
                            <p>Ready for analysis</p>
                        </div>
                        <div className="preview-container">
                            <img 
                                src={capturedImage || URL.createObjectURL(selectedFile)} 
                                alt="Preview" 
                                className="preview-image"
                            />
                            <div className="image-actions">
                                <button onClick={handleSubmit} disabled={loading} className="analyze-btn">
                                    <span className="btn-icon">{loading ? '⏳' : '🔍'}</span>
                                    <span className="btn-text">{loading ? 'Analyzing...' : 'Analyze Image'}</span>
                                </button>
                                <button onClick={clearSelection} className="clear-btn">
                                    <span className="btn-icon">🗑️</span>
                                    <span className="btn-text">Clear</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        <div className="error-icon">⚠️</div>
                        <div className="error-content">
                            <h3>Error</h3>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {result && (
                    <div className="results-card">
                        <div className="result-header">
                            <h2>🎯 Analysis Complete!</h2>
                            <div className="result-badge">{result.businessType}</div>
                        </div>
                        <div className="result-content">
                            <p className="result-description">{result.description}</p>
                            <div className="tags-container">
                                <h4>Key Features:</h4>
                                {result.tags.map((tag, index) => (
                                    <span key={index} className="tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="App-footer">
                <p>Powered by Gemini AI • Made with ❤️ for local businesses</p>
            </footer>
        </div>
    );
}

export default App;