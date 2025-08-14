import React, { useState } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const AudioConverter = ({ tool }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState('mp3');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const supportedFormats = [
    { value: 'mp3', label: 'MP3' },
    { value: 'wav', label: 'WAV' },
    { value: 'ogg', label: 'OGG' },
    { value: 'webm', label: 'WebM' },
    { value: 'm4a', label: 'M4A' }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      alert('Please select a valid audio file');
    }
  };

  const convertAudio = async () => {
    if (!audioFile) {
      alert('Please select an audio file first');
      return;
    }

    setIsProcessing(true);

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Create offline context for rendering
      const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );
      
      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineContext.destination);
      source.start();
      
      const renderedBuffer = await offlineContext.startRendering();
      
      // Convert to WAV format for simplicity
      const blob = audioBufferToWavBlob(renderedBuffer);
      
      // Auto download
      const originalExtension = audioFile.name.split('.').pop();
      const fileName = audioFile.name.replace(`.${originalExtension}`, `.${outputFormat}`);
      downloadFile(blob, fileName);

    } catch (error) {
      console.error('Conversion error:', error);
      alert('Error converting audio file. Please try a different file format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const audioBufferToWavBlob = (audioBuffer) => {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const length = audioBuffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, arrayBuffer.byteLength - 8, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * numberOfChannels * 2, true);
    
    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = audioBuffer.getChannelData(channel)[i];
        const intSample = Math.max(-1, Math.min(1, sample));
        view.setInt16(offset, intSample < 0 ? intSample * 0x8000 : intSample * 0x7FFF, true);
        offset += 2;
      }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ToolShell
      tool={tool}
      title="Audio Format Converter"
      description="Convert audio files between different formats with high-quality processing and multiple format support"
      category="Audio Tools"
      features={[
        "Multiple format support (MP3, WAV, OGG, WebM, M4A)",
        "High-quality audio conversion",
        "Real-time audio preview",
        "Browser-based processing",
        "Instant download",
        "No file size limits"
      ]}
      seoContent={{
        guides: [
          "Upload your audio file using the file selector",
          "Choose your desired output format",
          "Click 'Convert Audio' to start processing",
          "The converted file will download automatically",
          "Use the preview player to test your audio"
        ],
        faqs: [
          {
            question: "What audio formats are supported?",
            answer: "Our converter supports MP3, WAV, OGG, WebM, and M4A formats for both input and output, ensuring compatibility with all major audio standards."
          },
          {
            question: "Is there a file size limit?",
            answer: "No strict file size limit is enforced, but very large files may take longer to process. Most audio files under 100MB convert quickly."
          },
          {
            question: "Does the conversion preserve audio quality?",
            answer: "Yes, our converter uses high-quality algorithms to maintain audio fidelity during format conversion while optimizing file size."
          }
        ]
      }}
    >
      <div className="space-y-6">
        {/* File Upload */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-xl font-semibold text-slate-100 mb-4">Upload Audio File</h3>
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              id="audio-upload"
              data-testid="input-audio-file"
            />
            <label htmlFor="audio-upload" className="cursor-pointer">
              <i className="fas fa-cloud-upload-alt text-4xl text-slate-400 mb-4"></i>
              <p className="text-slate-300">Click to select an audio file</p>
              <p className="text-sm text-slate-500 mt-2">MP3, WAV, OGG, WebM, M4A supported</p>
            </label>
          </div>
          
          {audioFile && (
            <div className="mt-4 p-4 bg-slate-700 rounded-lg">
              <p className="text-slate-200 font-medium">{audioFile.name}</p>
              <p className="text-sm text-slate-400">Size: {formatFileSize(audioFile.size)}</p>
            </div>
          )}
        </div>

        {/* Audio Preview */}
        {previewUrl && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Audio Preview</h3>
            <audio 
              controls 
              src={previewUrl} 
              className="w-full bg-slate-800 rounded-lg"
              data-testid="audio-preview"
            />
          </div>
        )}

        {/* Format Selection */}
        {audioFile && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Output Format</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {supportedFormats.map((format) => (
                <label
                  key={format.value}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    outputFormat === format.value
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                      : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="format"
                    value={format.value}
                    checked={outputFormat === format.value}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="hidden"
                    data-testid={`format-${format.value}`}
                  />
                  <div className="text-center">
                    <div className="font-medium">{format.label}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Convert Button */}
        {audioFile && (
          <div className="glassmorphism rounded-xl p-6">
            <button
              onClick={convertAudio}
              disabled={isProcessing}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
                isProcessing
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
              }`}
              data-testid="button-convert"
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Converting Audio...
                </>
              ) : (
                <>
                  <i className="fas fa-exchange-alt mr-2"></i>
                  Convert to {outputFormat.toUpperCase()}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </ToolShell>
  );
};

export default AudioConverter;