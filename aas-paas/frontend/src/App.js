import React, { useState } from 'react';
import './App.css';
import { identifyImage } from './services/apiService'; // We will create this file next

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setResult(null); // Clear previous results
        setError(''); // Clear previous errors
    };

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
            // The backend sends back a JSON string, so we need to parse it
            const parsedResult = JSON.parse(response.data);
            setResult(parsedResult);
        } catch (err) {
            console.error(err);
            setError('Failed to analyze image. The backend might be down or an error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Aaas Paas AI-dentifier 🇮🇳</h1>
                <p>Upload a photo of a local shop to see what it is!</p>
            </header>
            <main className="App-main">
                <div className="upload-section">
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    <button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Analyzing...' : 'Identify Business'}
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {result && (
                    <div className="results-card">
                        <h2>Analysis Result</h2>
                        <h3>{result.businessType}</h3>
                        <p>{result.description}</p>
                        <div className="tags-container">
                            {result.tags.map((tag, index) => (
                                <span key={index} className="tag">{tag}</span>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;