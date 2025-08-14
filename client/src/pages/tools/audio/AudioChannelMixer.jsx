import React, { useState } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const AudioChannelMixer = ({ tool }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [mixMode, setMixMode] = useState('mono-to-stereo');
  const [leftGain, setLeftGain] = useState(1);
  const [rightGain, setRightGain] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [audioInfo, setAudioInfo] = useState(null);

  const mixModes = [
    { value: 'mono-to-stereo', label: 'Mono to Stereo' },
    { value: 'stereo-to-mono', label: 'Stereo to Mono' },
    { value: 'swap-channels', label: 'Swap L/R Channels' },
    { value: 'left-only', label: 'Left Channel Only' },
    { value: 'right-only', label: 'Right Channel Only' },
    { value: 'custom-mix', label: 'Custom Channel Mix' }
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
      
      // Get audio info
      const audio = new Audio(url);
      audio.addEventListener('loadedmetadata', () => {
        setAudioInfo({
          duration: audio.duration,
          // We'll detect channels during processing
        });
      });
    } else {
      alert('Please select a valid audio file');
    }
  };

  const processChannels = async () => {
    if (!audioFile) {
      alert('Please select an audio file first');
      return;
    }

    setIsProcessing(true);

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const inputChannels = audioBuffer.numberOfChannels;
      const sampleRate = audioBuffer.sampleRate;
      const length = audioBuffer.length;
      
      let outputChannels = inputChannels;
      let processedBuffer;
      
      switch (mixMode) {
        case 'mono-to-stereo':
          outputChannels = 2;
          processedBuffer = audioContext.createBuffer(outputChannels, length, sampleRate);
          
          if (inputChannels === 1) {
            const monoData = audioBuffer.getChannelData(0);
            const leftData = processedBuffer.getChannelData(0);
            const rightData = processedBuffer.getChannelData(1);
            
            // Copy mono to both channels
            leftData.set(monoData);
            rightData.set(monoData);
          } else {
            // Already stereo, just copy
            for (let ch = 0; ch < Math.min(inputChannels, outputChannels); ch++) {
              processedBuffer.getChannelData(ch).set(audioBuffer.getChannelData(ch));
            }
          }
          break;
          
        case 'stereo-to-mono':
          outputChannels = 1;
          processedBuffer = audioContext.createBuffer(outputChannels, length, sampleRate);
          const monoOutput = processedBuffer.getChannelData(0);
          
          if (inputChannels >= 2) {
            const leftInput = audioBuffer.getChannelData(0);
            const rightInput = audioBuffer.getChannelData(1);
            
            // Mix left and right channels
            for (let i = 0; i < length; i++) {
              monoOutput[i] = (leftInput[i] + rightInput[i]) * 0.5;
            }
          } else {
            monoOutput.set(audioBuffer.getChannelData(0));
          }
          break;
          
        case 'swap-channels':
          outputChannels = Math.max(2, inputChannels);
          processedBuffer = audioContext.createBuffer(outputChannels, length, sampleRate);
          
          if (inputChannels >= 2) {
            // Swap left and right
            processedBuffer.getChannelData(0).set(audioBuffer.getChannelData(1));
            processedBuffer.getChannelData(1).set(audioBuffer.getChannelData(0));
            
            // Copy additional channels as-is
            for (let ch = 2; ch < inputChannels; ch++) {
              processedBuffer.getChannelData(ch).set(audioBuffer.getChannelData(ch));
            }
          } else {
            processedBuffer.getChannelData(0).set(audioBuffer.getChannelData(0));
          }
          break;
          
        case 'left-only':
          outputChannels = 1;
          processedBuffer = audioContext.createBuffer(outputChannels, length, sampleRate);
          processedBuffer.getChannelData(0).set(audioBuffer.getChannelData(0));
          break;
          
        case 'right-only':
          outputChannels = 1;
          processedBuffer = audioContext.createBuffer(outputChannels, length, sampleRate);
          const rightChannel = inputChannels >= 2 ? audioBuffer.getChannelData(1) : audioBuffer.getChannelData(0);
          processedBuffer.getChannelData(0).set(rightChannel);
          break;
          
        case 'custom-mix':
          outputChannels = 2;
          processedBuffer = audioContext.createBuffer(outputChannels, length, sampleRate);
          
          if (inputChannels >= 2) {
            const leftInput = audioBuffer.getChannelData(0);
            const rightInput = audioBuffer.getChannelData(1);
            const leftOutput = processedBuffer.getChannelData(0);
            const rightOutput = processedBuffer.getChannelData(1);
            
            // Apply custom gains
            for (let i = 0; i < length; i++) {
              leftOutput[i] = leftInput[i] * leftGain;
              rightOutput[i] = rightInput[i] * rightGain;
            }
          } else {
            // Mono input, apply gains to create stereo
            const monoInput = audioBuffer.getChannelData(0);
            const leftOutput = processedBuffer.getChannelData(0);
            const rightOutput = processedBuffer.getChannelData(1);
            
            for (let i = 0; i < length; i++) {
              leftOutput[i] = monoInput[i] * leftGain;
              rightOutput[i] = monoInput[i] * rightGain;
            }
          }
          break;
          
        default:
          throw new Error('Unknown mix mode');
      }
      
      // Convert to WAV
      const blob = audioBufferToWavBlob(processedBuffer);
      const modeSuffix = mixMode.replace(/-/g, '_');
      const fileName = audioFile.name.replace(/\.[^/.]+$/, `_${modeSuffix}.wav`);
      downloadFile(blob, fileName);

    } catch (error) {
      console.error('Channel processing error:', error);
      alert('Error processing audio channels. Please try a different file.');
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
          
          {audioFile && audioInfo && (
            <div className="mt-4 p-4 bg-slate-800/50 rounded-lg">
              <p className="text-slate-300"><strong>File:</strong> {audioFile.name}</p>
              <p className="text-slate-300"><strong>Duration:</strong> {formatTime(audioInfo.duration)}</p>
            </div>
          )}
        </div>

        {/* Channel Settings */}
        {audioFile && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Channel Mixing Options</h3>
            
            <div className="mb-4">
              <label className="block text-slate-300 mb-2">Mix Mode</label>
              <select
                value={mixMode}
                onChange={(e) => setMixMode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-purple-400"
                data-testid="select-mix-mode"
              >
                {mixModes.map(mode => (
                  <option key={mode.value} value={mode.value}>{mode.label}</option>
                ))}
              </select>
            </div>
            
            {mixMode === 'custom-mix' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-slate-300 mb-2">Left Channel Gain</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={leftGain}
                      onChange={(e) => setLeftGain(parseFloat(e.target.value))}
                      className="flex-1"
                      data-testid="slider-left-gain"
                    />
                    <span className="text-slate-300 w-12 text-right">{leftGain.toFixed(1)}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-slate-300 mb-2">Right Channel Gain</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={rightGain}
                      onChange={(e) => setRightGain(parseFloat(e.target.value))}
                      className="flex-1"
                      data-testid="slider-right-gain"
                    />
                    <span className="text-slate-300 w-12 text-right">{rightGain.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            )}

            {previewUrl && (
              <div className="mt-4">
                <label className="block text-slate-300 mb-2">Preview Original Audio</label>
                <audio controls className="w-full" data-testid="audio-preview">
                  <source src={previewUrl} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        )}

        {/* Process Button */}
        {audioFile && (
          <div className="text-center">
            <button
              onClick={processChannels}
              disabled={isProcessing}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white px-8 py-3 rounded-xl transition-colors inline-flex items-center space-x-2"
              data-testid="button-process-channels"
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Processing Channels...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-random"></i>
                  <span>Process Audio Channels</span>
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
              <span>Convert mono to stereo with perfect quality</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Mix stereo to mono with proper balance</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Swap left and right channels</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Extract individual channels</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Custom channel gain control</span>
            </li>
          </ul>
        </div>
      </div>
    </ToolShell>
  );
};

export default AudioChannelMixer;