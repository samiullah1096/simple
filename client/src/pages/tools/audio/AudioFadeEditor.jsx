import React, { useState } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const AudioFadeEditor = ({ tool }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [fadeInDuration, setFadeInDuration] = useState(2);
  const [fadeOutDuration, setFadeOutDuration] = useState(2);
  const [crossfadeDuration, setCrossfadeDuration] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [duration, setDuration] = useState(0);
  const [fadeType, setFadeType] = useState('both');

  const fadeTypes = [
    { value: 'in', label: 'Fade In Only' },
    { value: 'out', label: 'Fade Out Only' },
    { value: 'both', label: 'Both Fade In & Out' },
    { value: 'crossfade', label: 'Crossfade Loop' }
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
      
      // Get audio duration
      const audio = new Audio(url);
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
    } else {
      alert('Please select a valid audio file');
    }
  };

  const applyFade = async () => {
    if (!audioFile) {
      alert('Please select an audio file first');
      return;
    }

    setIsProcessing(true);

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const sampleRate = audioBuffer.sampleRate;
      const fadeInSamples = Math.floor(fadeInDuration * sampleRate);
      const fadeOutSamples = Math.floor(fadeOutDuration * sampleRate);
      const crossfadeSamples = Math.floor(crossfadeDuration * sampleRate);
      
      // Create new buffer with same properties
      const processedBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        sampleRate
      );
      
      // Copy original data
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const originalData = audioBuffer.getChannelData(channel);
        const processedData = processedBuffer.getChannelData(channel);
        processedData.set(originalData);
      }
      
      // Apply fades
      for (let channel = 0; channel < processedBuffer.numberOfChannels; channel++) {
        const channelData = processedBuffer.getChannelData(channel);
        const length = channelData.length;
        
        // Fade In
        if (fadeType === 'in' || fadeType === 'both') {
          for (let i = 0; i < Math.min(fadeInSamples, length); i++) {
            const gain = applyCurve(i / fadeInSamples);
            channelData[i] *= gain;
          }
        }
        
        // Fade Out
        if (fadeType === 'out' || fadeType === 'both') {
          const startIndex = Math.max(0, length - fadeOutSamples);
          for (let i = startIndex; i < length; i++) {
            const progress = (i - startIndex) / fadeOutSamples;
            const gain = applyCurve(1 - progress);
            channelData[i] *= gain;
          }
        }
        
        // Crossfade (circular fade for loops)
        if (fadeType === 'crossfade' && crossfadeSamples > 0) {
          for (let i = 0; i < Math.min(crossfadeSamples, length); i++) {
            const fadeProgress = i / crossfadeSamples;
            const endIndex = length - crossfadeSamples + i;
            
            if (endIndex >= 0 && endIndex < length) {
              // Blend beginning and end for seamless loop
              const startGain = applyCurve(fadeProgress);
              const endGain = applyCurve(1 - fadeProgress);
              
              const blendedSample = channelData[i] * startGain + channelData[endIndex] * endGain;
              channelData[i] = blendedSample;
              channelData[endIndex] = blendedSample;
            }
          }
        }
      }
      
      // Convert to WAV
      const blob = audioBufferToWavBlob(processedBuffer);
      const fadeTypeSuffix = fadeType === 'crossfade' ? '_crossfade' : '_fade';
      const fileName = audioFile.name.replace(/\.[^/.]+$/, `${fadeTypeSuffix}.wav`);
      downloadFile(blob, fileName);

    } catch (error) {
      console.error('Fade processing error:', error);
      alert('Error applying fade effect. Please try a different file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const applyCurve = (x) => {
    // Apply smooth S-curve for natural fade
    return x * x * (3 - 2 * x);
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

        {/* Fade Settings */}
        {audioFile && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Fade Settings</h3>
            
            <div className="mb-4">
              <label className="block text-slate-300 mb-2">Fade Type</label>
              <select
                value={fadeType}
                onChange={(e) => setFadeType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-purple-400"
                data-testid="select-fade-type"
              >
                {fadeTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(fadeType === 'in' || fadeType === 'both') && (
                <div>
                  <label className="block text-slate-300 mb-2">Fade In Duration (seconds)</label>
                  <input
                    type="number"
                    min="0.1"
                    max={duration / 2}
                    step="0.1"
                    value={fadeInDuration}
                    onChange={(e) => setFadeInDuration(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-purple-400"
                    data-testid="input-fade-in"
                  />
                </div>
              )}
              
              {(fadeType === 'out' || fadeType === 'both') && (
                <div>
                  <label className="block text-slate-300 mb-2">Fade Out Duration (seconds)</label>
                  <input
                    type="number"
                    min="0.1"
                    max={duration / 2}
                    step="0.1"
                    value={fadeOutDuration}
                    onChange={(e) => setFadeOutDuration(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-purple-400"
                    data-testid="input-fade-out"
                  />
                </div>
              )}
              
              {fadeType === 'crossfade' && (
                <div className="md:col-span-2">
                  <label className="block text-slate-300 mb-2">Crossfade Duration (seconds)</label>
                  <input
                    type="number"
                    min="0.1"
                    max={duration / 4}
                    step="0.1"
                    value={crossfadeDuration}
                    onChange={(e) => setCrossfadeDuration(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-purple-400"
                    data-testid="input-crossfade"
                  />
                  <p className="text-sm text-slate-400 mt-1">Creates seamless loop by blending start and end</p>
                </div>
              )}
            </div>

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

        {/* Apply Fade Button */}
        {audioFile && (
          <div className="text-center">
            <button
              onClick={applyFade}
              disabled={isProcessing}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white px-8 py-3 rounded-xl transition-colors inline-flex items-center space-x-2"
              data-testid="button-apply-fade"
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Applying Fade...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-adjust"></i>
                  <span>Apply Fade Effect</span>
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
              <span>Smooth S-curve fade transitions</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Crossfade for seamless loops</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Precise timing control</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Multiple fade types</span>
            </li>
          </ul>
        </div>
      </div>
    </ToolShell>
  );
};

export default AudioFadeEditor;