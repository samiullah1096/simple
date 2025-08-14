import React, { useState, useRef } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const ScreenCapture = ({ tool }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [captureType, setCaptureType] = useState('screen'); // screen, window, tab
  const [errorMessage, setErrorMessage] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const checkSupport = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      setErrorMessage('Screen capture is not supported in your browser. Please use a modern browser like Chrome, Firefox, or Edge.');
      return false;
    }
    return true;
  };

  const startCapture = async () => {
    if (!checkSupport()) return;

    setErrorMessage('');
    setIsCapturing(true);

    try {
      const constraints = {
        video: {
          mediaSource: captureType,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Stop capture after user ends screen sharing
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        stopCapture();
      });

    } catch (error) {
      console.error('Error starting screen capture:', error);
      
      if (error.name === 'NotAllowedError') {
        setErrorMessage('Screen capture permission was denied. Please allow screen sharing and try again.');
      } else if (error.name === 'NotSupportedError') {
        setErrorMessage('Screen capture is not supported on this device or browser.');
      } else {
        setErrorMessage('Error starting screen capture. Please try again.');
      }
      
      setIsCapturing(false);
    }
  };

  const stopCapture = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  };

  const takeScreenshot = () => {
    if (!videoRef.current || !canvasRef.current) {
      setErrorMessage('Video stream not available. Please start screen capture first.');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to image data URL
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      setCapturedImage({
        url,
        blob,
        width: canvas.width,
        height: canvas.height,
        timestamp: new Date().toISOString()
      });
    }, 'image/png');
  };

  const downloadImage = () => {
    if (!capturedImage) return;

    const a = document.createElement('a');
    a.href = capturedImage.url;
    a.download = `screenshot_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyToClipboard = async () => {
    if (!capturedImage) return;

    try {
      // Try to copy image to clipboard (modern browsers)
      if (navigator.clipboard && navigator.clipboard.write) {
        const clipboardItem = new ClipboardItem({
          'image/png': capturedImage.blob
        });
        await navigator.clipboard.write([clipboardItem]);
      } else {
        // Fallback: copy image URL
        await navigator.clipboard.writeText(capturedImage.url);
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      setErrorMessage('Failed to copy to clipboard. Try downloading the image instead.');
    }
  };

  const clearCapture = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage.url);
      setCapturedImage(null);
    }
    setErrorMessage('');
  };

  const retakeScreenshot = () => {
    clearCapture();
    if (!isCapturing) {
      startCapture();
    }
  };

  return (
    <ToolShell tool={tool}>
      <div className="space-y-6">
        {/* Capture Controls */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Screen Capture</h3>
          
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                {errorMessage}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 mb-2">Capture Type</label>
              <select
                value={captureType}
                onChange={(e) => setCaptureType(e.target.value)}
                disabled={isCapturing}
                className="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-green-400"
                data-testid="select-capture-type"
              >
                <option value="screen">Entire Screen</option>
                <option value="window">Application Window</option>
                <option value="browser">Browser Tab</option>
              </select>
            </div>

            <div className="flex space-x-3">
              {!isCapturing ? (
                <button
                  onClick={startCapture}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                  data-testid="button-start-capture"
                >
                  <i className="fas fa-video mr-2"></i>
                  Start Screen Share
                </button>
              ) : (
                <>
                  <button
                    onClick={takeScreenshot}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                    data-testid="button-take-screenshot"
                  >
                    <i className="fas fa-camera mr-2"></i>
                    Take Screenshot
                  </button>
                  <button
                    onClick={stopCapture}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors"
                    data-testid="button-stop-capture"
                  >
                    <i className="fas fa-stop mr-2"></i>
                    Stop
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Live Preview */}
        {isCapturing && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Live Preview</h3>
            <div className="bg-slate-800/30 rounded-lg p-4 text-center">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="max-w-full max-h-96 rounded-lg"
                data-testid="video-preview"
              />
              <p className="text-slate-400 text-sm mt-2">
                <i className="fas fa-info-circle mr-2"></i>
                Screen sharing is active. Click "Take Screenshot" to capture the current frame.
              </p>
            </div>
          </div>
        )}

        {/* Captured Screenshot */}
        {capturedImage && (
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-100">Captured Screenshot</h3>
              <div className="flex space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
                  data-testid="button-copy-clipboard"
                >
                  <i className="fas fa-copy mr-2"></i>
                  Copy
                </button>
                <button
                  onClick={downloadImage}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                  data-testid="button-download"
                >
                  <i className="fas fa-download mr-2"></i>
                  Download
                </button>
                <button
                  onClick={retakeScreenshot}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                  data-testid="button-retake"
                >
                  <i className="fas fa-redo mr-2"></i>
                  Retake
                </button>
                <button
                  onClick={clearCapture}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm"
                  data-testid="button-clear"
                >
                  <i className="fas fa-trash mr-2"></i>
                  Clear
                </button>
              </div>
            </div>
            
            <div className="bg-slate-800/30 rounded-lg p-4">
              <img
                src={capturedImage.url}
                alt="Captured screenshot"
                className="max-w-full h-auto rounded-lg mx-auto block"
                data-testid="image-captured"
              />
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-slate-400">Resolution</div>
                  <div className="text-slate-100 font-semibold">
                    {capturedImage.width} × {capturedImage.height}
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-slate-400">Format</div>
                  <div className="text-slate-100 font-semibold">PNG</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-slate-400">Captured</div>
                  <div className="text-slate-100 font-semibold">
                    {new Date(capturedImage.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Browser Support Info */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Browser Support & Tips</h3>
          <div className="space-y-3 text-slate-300">
            <div className="flex items-start space-x-2">
              <i className="fas fa-check text-green-400 mt-1"></i>
              <span><strong>Chrome/Edge:</strong> Full support for screen, window, and tab capture</span>
            </div>
            <div className="flex items-start space-x-2">
              <i className="fas fa-check text-green-400 mt-1"></i>
              <span><strong>Firefox:</strong> Supports screen and window capture</span>
            </div>
            <div className="flex items-start space-x-2">
              <i className="fas fa-info-circle text-blue-400 mt-1"></i>
              <span><strong>Permission:</strong> Browser will ask for screen sharing permission</span>
            </div>
            <div className="flex items-start space-x-2">
              <i className="fas fa-info-circle text-blue-400 mt-1"></i>
              <span><strong>Privacy:</strong> All processing happens locally in your browser</span>
            </div>
            <div className="flex items-start space-x-2">
              <i className="fas fa-lightbulb text-yellow-400 mt-1"></i>
              <span><strong>Tip:</strong> For best quality, capture at your screen's native resolution</span>
            </div>
          </div>
        </div>

        {/* Hidden canvas for screenshot processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Features */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Features</h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Capture entire screen, specific windows, or browser tabs</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>High-quality PNG output with original resolution</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Live preview before taking screenshots</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Copy to clipboard or download as file</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Privacy-focused: all processing in your browser</span>
            </li>
          </ul>
        </div>
      </div>
    </ToolShell>
  );
};

export default ScreenCapture;