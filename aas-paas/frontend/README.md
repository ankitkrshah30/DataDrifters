# Aaas Paas AI-dentifier Frontend

A React-based frontend application that allows users to analyze images of local businesses and surroundings using AI-powered image recognition.

## Features

### 🖼️ Multiple Input Methods

1. **File Upload**: Traditional file selection from your device
2. **Camera Capture**: Take photos directly using your device's camera
3. **Paste from Clipboard**: Paste images copied from other applications

### 📱 Camera Functionality

- **Real-time Camera Access**: Opens your device's camera for live preview
- **High-Quality Capture**: Captures photos at optimal resolution
- **Back Camera Priority**: Automatically uses the back camera when available
- **Easy Controls**: Simple capture and cancel buttons

### 📋 Paste Functionality

- **Universal Paste Support**: Works with images copied from any source
- **Keyboard Shortcut**: Use Ctrl+V (or Cmd+V on Mac) to paste images
- **Instant Recognition**: Automatically detects pasted image content

### 🎯 Image Analysis

- **AI-Powered Recognition**: Uses Gemini API for intelligent image analysis
- **Business Type Detection**: Identifies the type of business or location
- **Detailed Descriptions**: Provides comprehensive analysis of the image
- **Smart Tagging**: Generates relevant tags for easy categorization

## How to Use

### Camera Mode
1. Click the "📷 Camera" tab
2. Click "📷 Open Camera" to start your camera
3. Position your device to capture the desired image
4. Click "📸 Capture Photo" to take the picture
5. The captured image will be ready for analysis

### Paste Mode
1. Click the "📋 Paste Image" tab
2. Copy an image from any application (right-click → Copy)
3. Use Ctrl+V (or Cmd+V) to paste the image
4. The pasted image will be ready for analysis

### Upload Mode
1. Click the "📁 Upload Image" tab
2. Click "Choose an image file" to browse your device
3. Select an image file and it will be ready for analysis

### Analysis
1. After selecting an image through any method, click "🔍 Analyze Image"
2. Wait for the AI analysis to complete
3. View the detailed results including business type, description, and tags

## Technical Details

- **React 18+**: Built with modern React features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Camera API**: Uses `navigator.mediaDevices.getUserMedia()` for camera access
- **Clipboard API**: Leverages browser clipboard functionality for paste support
- **Canvas API**: Uses HTML5 Canvas for image capture and processing

## Browser Compatibility

- **Chrome**: Full support for all features
- **Firefox**: Full support for all features
- **Safari**: Full support for all features
- **Edge**: Full support for all features

## Camera Permissions

The application requires camera access permissions to use the camera functionality. Users will be prompted to allow camera access when they first try to use the camera feature.

## Development

To run the development server:

```bash
npm start
```

The app will open in your browser at `http://localhost:3000`.

## Building for Production

To create a production build:

```bash
npm run build
```

## Dependencies

- React 18+
- Axios for API communication
- Modern CSS with responsive design
