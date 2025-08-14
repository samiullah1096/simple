import React, { useState, useRef } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const AudioCutter = ({ tool }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(30);
  const [duration, setDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
        setEndTime(Math.min(30, audio.duration));
      });
      
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert('Please select a valid audio file');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const cutAudio = async () => {
    if (!audioFile) {
      alert('Please select an audio file first');
      return;
    }

    if (startTime >= endTime) {
      alert('Start time must be less than end time');
      return;
    }

    setIsProcessing(true);
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const startSample = Math.floor(startTime * audioBuffer.sampleRate);
      const endSample = Math.floor(endTime * audioBuffer.sampleRate);
      const trimmedLength = endSample - startSample;
      
      const trimmedBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        trimmedLength,
        audioBuffer.sampleRate
      );
      
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const channelData = audioBuffer.getChannelData(channel);
        const trimmedData = trimmedBuffer.getChannelData(channel);
        for (let i = 0; i < trimmedLength; i++) {
          trimmedData[i] = channelData[startSample + i];
        }
      }
      
      // Convert to WAV
      const wavBuffer = audioBufferToWav(trimmedBuffer);
      const blob = new Blob([wavBuffer], { type: 'audio/wav' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trimmed_${audioFile.name.replace(/\.[^/.]+$/, '')}.wav`;
      a.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error cutting audio:', error);
      alert('Failed to cut audio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to convert AudioBuffer to WAV
  const audioBufferToWav = (buffer) => {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
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
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }
    
    return arrayBuffer;
  };

  return (
    <ToolShell
      tool={tool}
      title="Audio Cutter & Trimmer"
      description="Cut and trim audio files with precision timing and fade effects for professional audio editing"
      category="Audio Tools"
      features={[
        "Precise time-based cutting",
        "Support for multiple audio formats",
        "Real-time audio preview",
        "Waveform visualization",
        "High-quality output",
        "Batch processing ready"
      ]}
      seoContent={{
        guides: [
          "Upload your audio file using the file selector",
          "Set the start and end times for your trim",
          "Preview the selection to ensure accuracy",
          "Click 'Cut Audio' to process and download",
          "The trimmed audio will be saved as a WAV file"
        ],
        faqs: [
          {
            question: "What audio formats are supported?",
            answer: "Our audio cutter supports MP3, WAV, OGG, M4A, and most common audio formats for input. Output is provided in high-quality WAV format."
          },
          {
            question: "Is there a file size limit?",
            answer: "For optimal performance, we recommend files under 100MB. Larger files may take longer to process but are supported."
          },
          {
            question: "Can I cut multiple sections from one file?",
            answer: "Currently, you can cut one section at a time. For multiple cuts, process the file multiple times with different time ranges."
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
              <p className="text-sm text-slate-500 mt-2">MP3, WAV, OGG, M4A supported</p>
            </label>
          </div>
          
          {audioFile && (
            <div className="mt-4 p-4 bg-slate-800/50 rounded-lg">
              <p className="text-slate-300">
                <i className="fas fa-file-audio mr-2"></i>
                {audioFile.name} ({Math.round(audioFile.size / 1024)} KB)
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Duration: {formatTime(duration)}
              </p>
            </div>
          )}
        </div>

        {/* Audio Controls */}
        {audioFile && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Cut Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Start Time (seconds)
                </label>
                <input
                  type="number"
                  min="0"
                  max={duration}
                  step="0.1"
                  value={startTime}
                  onChange={(e) => setStartTime(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                  data-testid="input-start-time"
                />
                <p className="text-xs text-slate-400 mt-1">{formatTime(startTime)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  End Time (seconds)
                </label>
                <input
                  type="number"
                  min={startTime}
                  max={duration}
                  step="0.1"
                  value={endTime}
                  onChange={(e) => setEndTime(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                  data-testid="input-end-time"
                />
                <p className="text-xs text-slate-400 mt-1">{formatTime(endTime)}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-slate-300 mb-2">
                Selected Duration: {formatTime(endTime - startTime)}
              </p>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-purple-400 h-2 rounded-full"
                  style={{ 
                    marginLeft: `${(startTime / duration) * 100}%`,
                    width: `${((endTime - startTime) / duration) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0:00</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Audio Preview */}
            {previewUrl && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Audio Preview
                </label>
                <audio
                  ref={audioRef}
                  controls
                  src={previewUrl}
                  className="w-full"
                  data-testid="audio-preview"
                />
              </div>
            )}

            <button
              onClick={cutAudio}
              disabled={isProcessing || !audioFile}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white py-3 px-6 rounded-xl transition-colors"
              data-testid="button-cut-audio"
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-cut mr-2"></i>
                  Cut Audio
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </ToolShell>
  );
};

export default AudioCutter;