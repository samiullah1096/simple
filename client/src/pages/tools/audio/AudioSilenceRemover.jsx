import React, { useState } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const AudioSilenceRemover = ({ tool }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [silenceThreshold, setSilenceThreshold] = useState(-40);
  const [minSilenceDuration, setMinSilenceDuration] = useState(0.5);
  const [paddingDuration, setPaddingDuration] = useState(0.1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [audioInfo, setAudioInfo] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setAnalysisResult(null);
      
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Get audio info
      const audio = new Audio(url);
      audio.addEventListener('loadedmetadata', () => {
        setAudioInfo({
          duration: audio.duration
        });
      });
    } else {
      alert('Please select a valid audio file');
    }
  };

  const analyzeSilence = async () => {
    if (!audioFile) return;

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const sampleRate = audioBuffer.sampleRate;
      const channelData = audioBuffer.getChannelData(0);
      const length = channelData.length;
      
      // Convert to mono if stereo
      let monoData = channelData;
      if (audioBuffer.numberOfChannels > 1) {
        monoData = new Float32Array(length);
        for (let i = 0; i < length; i++) {
          let sum = 0;
          for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
            sum += audioBuffer.getChannelData(ch)[i];
          }
          monoData[i] = sum / audioBuffer.numberOfChannels;
        }
      }
      
      // Calculate RMS values in small windows
      const windowSize = Math.floor(sampleRate * 0.01); // 10ms windows
      const rmsValues = [];
      const threshold = Math.pow(10, silenceThreshold / 20); // Convert dB to linear
      
      for (let i = 0; i < length; i += windowSize) {
        let rms = 0;
        const end = Math.min(i + windowSize, length);
        for (let j = i; j < end; j++) {
          rms += monoData[j] * monoData[j];
        }
        rms = Math.sqrt(rms / (end - i));
        rmsValues.push({
          time: i / sampleRate,
          rms: rms,
          isSilent: rms < threshold
        });
      }
      
      // Find silence regions
      const silenceRegions = [];
      let silenceStart = null;
      
      for (let i = 0; i < rmsValues.length; i++) {
        const current = rmsValues[i];
        
        if (current.isSilent && silenceStart === null) {
          silenceStart = current.time;
        } else if (!current.isSilent && silenceStart !== null) {
          const duration = current.time - silenceStart;
          if (duration >= minSilenceDuration) {
            silenceRegions.push({
              start: silenceStart,
              end: current.time,
              duration: duration
            });
          }
          silenceStart = null;
        }
      }
      
      // Handle silence at the end
      if (silenceStart !== null) {
        const duration = (length / sampleRate) - silenceStart;
        if (duration >= minSilenceDuration) {
          silenceRegions.push({
            start: silenceStart,
            end: length / sampleRate,
            duration: duration
          });
        }
      }
      
      const totalSilence = silenceRegions.reduce((sum, region) => sum + region.duration, 0);
      const originalDuration = audioBuffer.duration;
      const estimatedNewDuration = originalDuration - totalSilence;
      
      setAnalysisResult({
        silenceRegions,
        totalSilence,
        originalDuration,
        estimatedNewDuration,
        silencePercentage: (totalSilence / originalDuration) * 100
      });
      
    } catch (error) {
      console.error('Silence analysis error:', error);
    }
  };

  const removeSilence = async () => {
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
      const numberOfChannels = audioBuffer.numberOfChannels;
      const length = audioBuffer.length;
      
      // Find silence regions
      const channelData = audioBuffer.getChannelData(0);
      let monoData = channelData;
      if (numberOfChannels > 1) {
        monoData = new Float32Array(length);
        for (let i = 0; i < length; i++) {
          let sum = 0;
          for (let ch = 0; ch < numberOfChannels; ch++) {
            sum += audioBuffer.getChannelData(ch)[i];
          }
          monoData[i] = sum / numberOfChannels;
        }
      }
      
      // Calculate which samples to keep
      const windowSize = Math.floor(sampleRate * 0.01); // 10ms windows
      const threshold = Math.pow(10, silenceThreshold / 20);
      const paddingSamples = Math.floor(paddingDuration * sampleRate);
      const minSilenceSamples = Math.floor(minSilenceDuration * sampleRate);
      
      const keepSamples = new Array(length).fill(true);
      
      // Mark silence regions
      for (let i = 0; i < length; i += windowSize) {
        let rms = 0;
        const end = Math.min(i + windowSize, length);
        for (let j = i; j < end; j++) {
          rms += monoData[j] * monoData[j];
        }
        rms = Math.sqrt(rms / (end - i));
        
        if (rms < threshold) {
          for (let j = i; j < end; j++) {
            keepSamples[j] = false;
          }
        }
      }
      
      // Find continuous silence regions and only remove long ones
      let silenceStart = null;
      for (let i = 0; i < length; i++) {
        if (!keepSamples[i] && silenceStart === null) {
          silenceStart = i;
        } else if (keepSamples[i] && silenceStart !== null) {
          const silenceLength = i - silenceStart;
          if (silenceLength < minSilenceSamples) {
            // Keep short silence
            for (let j = silenceStart; j < i; j++) {
              keepSamples[j] = true;
            }
          } else {
            // Add padding around longer silence
            const padStart = Math.max(0, silenceStart - paddingSamples);
            const padEnd = Math.min(length, i + paddingSamples);
            for (let j = padStart; j < silenceStart; j++) {
              keepSamples[j] = true;
            }
            for (let j = i; j < padEnd; j++) {
              keepSamples[j] = true;
            }
          }
          silenceStart = null;
        }
      }
      
      // Count samples to keep
      const keptSamples = keepSamples.filter(keep => keep).length;
      
      if (keptSamples === length) {
        alert('No significant silence detected with current settings.');
        setIsProcessing(false);
        return;
      }
      
      // Create new buffer with only non-silent parts
      const newBuffer = audioContext.createBuffer(numberOfChannels, keptSamples, sampleRate);
      
      for (let ch = 0; ch < numberOfChannels; ch++) {
        const inputData = audioBuffer.getChannelData(ch);
        const outputData = newBuffer.getChannelData(ch);
        let outputIndex = 0;
        
        for (let i = 0; i < length; i++) {
          if (keepSamples[i]) {
            outputData[outputIndex++] = inputData[i];
          }
        }
      }
      
      // Convert to WAV
      const blob = audioBufferToWavBlob(newBuffer);
      const fileName = audioFile.name.replace(/\.[^/.]+$/, '_silence_removed.wav');
      downloadFile(blob, fileName);

    } catch (error) {
      console.error('Silence removal error:', error);
      alert('Error removing silence. Please try a different file.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Run analysis when parameters change
  React.useEffect(() => {
    if (audioFile) {
      const timeoutId = setTimeout(analyzeSilence, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [audioFile, silenceThreshold, minSilenceDuration]);

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

        {/* Silence Detection Settings */}
        {audioFile && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Silence Detection Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-slate-300 mb-2">Silence Threshold (dB)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="-60"
                    max="-10"
                    step="1"
                    value={silenceThreshold}
                    onChange={(e) => setSilenceThreshold(parseInt(e.target.value))}
                    className="flex-1"
                    data-testid="slider-threshold"
                  />
                  <span className="text-slate-300 w-12 text-right">{silenceThreshold}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Lower = more sensitive</p>
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">Min Silence Duration (s)</label>
                <input
                  type="number"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={minSilenceDuration}
                  onChange={(e) => setMinSilenceDuration(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-purple-400"
                  data-testid="input-min-duration"
                />
                <p className="text-xs text-slate-400 mt-1">Only remove longer silences</p>
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">Padding (s)</label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.05"
                  value={paddingDuration}
                  onChange={(e) => setPaddingDuration(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-purple-400"
                  data-testid="input-padding"
                />
                <p className="text-xs text-slate-400 mt-1">Keep around speech</p>
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
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Silence Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-400">{formatTime(analysisResult.totalSilence)}</div>
                <div className="text-slate-300 text-sm">Total Silence</div>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{formatTime(analysisResult.estimatedNewDuration)}</div>
                <div className="text-slate-300 text-sm">After Removal</div>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{analysisResult.silencePercentage.toFixed(1)}%</div>
                <div className="text-slate-300 text-sm">Silence Ratio</div>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{analysisResult.silenceRegions.length}</div>
                <div className="text-slate-300 text-sm">Silence Regions</div>
              </div>
            </div>

            {analysisResult.silenceRegions.length > 0 && (
              <div>
                <h4 className="text-slate-100 font-medium mb-2">Detected Silence Regions</h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {analysisResult.silenceRegions.slice(0, 10).map((region, index) => (
                    <div key={index} className="text-sm text-slate-300 bg-slate-800/30 rounded px-2 py-1">
                      {formatTime(region.start)} - {formatTime(region.end)} ({region.duration.toFixed(1)}s)
                    </div>
                  ))}
                  {analysisResult.silenceRegions.length > 10 && (
                    <div className="text-sm text-slate-400">... and {analysisResult.silenceRegions.length - 10} more regions</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Remove Silence Button */}
        {audioFile && analysisResult && analysisResult.silenceRegions.length > 0 && (
          <div className="text-center">
            <button
              onClick={removeSilence}
              disabled={isProcessing}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white px-8 py-3 rounded-xl transition-colors inline-flex items-center space-x-2"
              data-testid="button-remove-silence"
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Removing Silence...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-volume-mute"></i>
                  <span>Remove Silence</span>
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
              <span>Intelligent silence detection with adjustable sensitivity</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Preserve short pauses and natural speech rhythm</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Configurable padding to maintain context</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Real-time analysis and preview</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Perfect for podcast and voice recording cleanup</span>
            </li>
          </ul>
        </div>
      </div>
    </ToolShell>
  );
};

export default AudioSilenceRemover;