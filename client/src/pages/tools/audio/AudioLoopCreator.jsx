import React, { useState } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const AudioLoopCreator = ({ tool }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [loopStartTime, setLoopStartTime] = useState(0);
  const [loopEndTime, setLoopEndTime] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [duration, setDuration] = useState(0);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Get audio duration
      const audio = new Audio(url);
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
        setLoopEndTime(Math.min(5, audio.duration));
      });
    } else {
      alert('Please select a valid audio file');
    }
  };

  const createLoop = async () => {
    if (!audioFile) {
      alert('Please select an audio file first');
      return;
    }

    if (loopStartTime >= loopEndTime) {
      alert('Start time must be less than end time');
      return;
    }

    setIsProcessing(true);

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const sampleRate = audioBuffer.sampleRate;
      const startSample = Math.floor(loopStartTime * sampleRate);
      const endSample = Math.floor(loopEndTime * sampleRate);
      const loopLength = endSample - startSample;
      
      // Create loop buffer
      const loopBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        loopLength,
        sampleRate
      );
      
      // Copy loop section
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const channelData = audioBuffer.getChannelData(channel);
        const loopChannelData = loopBuffer.getChannelData(channel);
        
        for (let i = 0; i < loopLength; i++) {
          loopChannelData[i] = channelData[startSample + i];
        }
      }
      
      // Apply crossfade to make seamless loop
      const fadeLength = Math.min(1000, Math.floor(loopLength * 0.1)); // 10% fade or 1000 samples
      
      for (let channel = 0; channel < loopBuffer.numberOfChannels; channel++) {
        const channelData = loopBuffer.getChannelData(channel);
        
        // Fade in at start
        for (let i = 0; i < fadeLength; i++) {
          const fadeInGain = i / fadeLength;
          channelData[i] *= fadeInGain;
        }
        
        // Crossfade at end
        for (let i = 0; i < fadeLength; i++) {
          const fadeOutGain = 1 - (i / fadeLength);
          const endIndex = loopLength - fadeLength + i;
          const startIndex = i;
          
          // Blend end with beginning
          channelData[endIndex] = channelData[endIndex] * fadeOutGain + channelData[startIndex] * (1 - fadeOutGain);
        }
      }
      
      // Convert to WAV
      const blob = audioBufferToWavBlob(loopBuffer);
      const fileName = audioFile.name.replace(/\.[^/.]+$/, '_loop.wav');
      downloadFile(blob, fileName);

    } catch (error) {
      console.error('Loop creation error:', error);
      alert('Error creating audio loop. Please try a different file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const audioBufferToWavBlob = (buffer) => {
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

    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ToolShell tool={tool}>
      <div className="space-y-6">
        {/* File Upload */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Upload Audio File</h3>
          <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              id="audio-upload"
              data-testid="input-audio-file"
            />
            <label
              htmlFor="audio-upload"
              className="cursor-pointer flex flex-col items-center space-y-4"
            >
              <i className="fas fa-upload text-4xl text-purple-400"></i>
              <div>
                <p className="text-slate-100 font-medium">Choose audio file</p>
                <p className="text-slate-400 text-sm">MP3, WAV, OGG, M4A supported</p>
              </div>
            </label>
          </div>
          
          {audioFile && (
            <div className="mt-4 p-4 bg-slate-800/50 rounded-lg">
              <p className="text-slate-300"><strong>File:</strong> {audioFile.name}</p>
              <p className="text-slate-300"><strong>Duration:</strong> {formatTime(duration)}</p>
            </div>
          )}
        </div>

        {/* Loop Settings */}
        {audioFile && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Loop Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-slate-300 mb-2">Start Time (seconds)</label>
                <input
                  type="number"
                  min="0"
                  max={duration}
                  step="0.1"
                  value={loopStartTime}
                  onChange={(e) => setLoopStartTime(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-purple-400"
                  data-testid="input-start-time"
                />
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">End Time (seconds)</label>
                <input
                  type="number"
                  min="0"
                  max={duration}
                  step="0.1"
                  value={loopEndTime}
                  onChange={(e) => setLoopEndTime(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-purple-400"
                  data-testid="input-end-time"
                />
              </div>
            </div>

            {previewUrl && (
              <div className="mb-4">
                <label className="block text-slate-300 mb-2">Preview Original Audio</label>
                <audio controls className="w-full" data-testid="audio-preview">
                  <source src={previewUrl} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            <div className="text-sm text-slate-400 mb-4">
              Loop duration: {formatTime(loopEndTime - loopStartTime)}
            </div>
          </div>
        )}

        {/* Create Loop Button */}
        {audioFile && (
          <div className="text-center">
            <button
              onClick={createLoop}
              disabled={isProcessing}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white px-8 py-3 rounded-xl transition-colors inline-flex items-center space-x-2"
              data-testid="button-create-loop"
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Creating Loop...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-redo"></i>
                  <span>Create Seamless Loop</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Features */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Features</h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Seamless crossfade for perfect loops</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Precise timing control</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>High-quality audio processing</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Multiple audio format support</span>
            </li>
          </ul>
        </div>
      </div>
    </ToolShell>
  );
};

export default AudioLoopCreator;