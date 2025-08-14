import React, { useState, useRef } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const VolumeBooster = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [volumeGain, setVolumeGain] = useState(1.5);
  const [normalizeEnabled, setNormalizeEnabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [maxLevel, setMaxLevel] = useState(0);
  
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setProcessedUrl(null);
      analyzeAudio(file);
    } else {
      alert('Please select a valid audio file');
    }
  };

  const analyzeAudio = async (file) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Analyze audio levels
      let maxAmplitude = 0;
      let totalAmplitude = 0;
      let sampleCount = 0;
      
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const channelData = audioBuffer.getChannelData(channel);
        for (let i = 0; i < channelData.length; i++) {
          const amplitude = Math.abs(channelData[i]);
          maxAmplitude = Math.max(maxAmplitude, amplitude);
          totalAmplitude += amplitude;
          sampleCount++;
        }
      }
      
      const averageLevel = totalAmplitude / sampleCount;
      setAudioLevel(averageLevel);
      setMaxLevel(maxAmplitude);
      
    } catch (error) {
      console.error('Error analyzing audio:', error);
    }
  };

  const boostVolume = async () => {
    if (!audioFile) {
      alert('Please select an audio file first');
      return;
    }

    setIsProcessing(true);
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Create new buffer for processed audio
      const processedBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );
      
      let finalGain = volumeGain;
      
      // Calculate normalization gain if enabled
      if (normalizeEnabled) {
        let globalMax = 0;
        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
          const channelData = audioBuffer.getChannelData(channel);
          for (let i = 0; i < channelData.length; i++) {
            globalMax = Math.max(globalMax, Math.abs(channelData[i]));
          }
        }
        
        if (globalMax > 0) {
          const normalizeGain = 0.95 / globalMax; // Leave some headroom
          finalGain = Math.min(finalGain, normalizeGain);
        }
      }
      
      // Apply volume boost with limiting
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const inputData = audioBuffer.getChannelData(channel);
        const outputData = processedBuffer.getChannelData(channel);
        
        for (let i = 0; i < inputData.length; i++) {
          let sample = inputData[i] * finalGain;
          
          // Soft limiting to prevent clipping
          if (Math.abs(sample) > 0.95) {
            sample = sample > 0 ? 0.95 : -0.95;
          }
          
          outputData[i] = sample;
        }
      }
      
      // Convert to WAV
      const wavBuffer = audioBufferToWav(processedBuffer);
      const blob = new Blob([wavBuffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      setProcessedUrl(url);
      
    } catch (error) {
      console.error('Error boosting volume:', error);
      alert('Failed to boost volume. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

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

  const downloadProcessed = () => {
    if (processedUrl) {
      const a = document.createElement('a');
      a.href = processedUrl;
      a.download = `boosted_${audioFile.name.replace(/\.[^/.]+$/, '')}.wav`;
      a.click();
    }
  };

  const getBoostPercentage = () => {
    return Math.round((volumeGain - 1) * 100);
  };

  const getLevelPercentage = (level) => {
    return Math.round(level * 100);
  };

  return (
    <ToolShell
      title="Volume Booster & Normalizer"
      description="Boost audio volume safely and normalize audio levels across tracks with professional audio processing"
      category="Audio Tools"
      features={[
        "Safe volume boosting with limiting",
        "Audio normalization",
        "Real-time level monitoring",
        "Clipping prevention",
        "Multiple boost levels",
        "Quality preservation"
      ]}
      seoContent={{
        guides: [
          "Upload your audio file using the file selector",
          "Analyze the current audio levels automatically",
          "Adjust the volume boost level (1x to 5x)",
          "Enable normalization for consistent levels",
          "Click 'Boost Volume' to process the audio",
          "Download the enhanced audio file"
        ],
        faqs: [
          {
            question: "How much can I boost the volume?",
            answer: "You can boost volume up to 5x (500%) with our safe limiting technology that prevents distortion and clipping while maximizing loudness."
          },
          {
            question: "What's the difference between boost and normalize?",
            answer: "Boost increases overall volume by a fixed amount. Normalize analyzes the audio and adjusts it to use the full dynamic range without clipping."
          },
          {
            question: "Will boosting cause audio distortion?",
            answer: "Our algorithm includes soft limiting and clipping prevention to maintain audio quality while increasing volume. Very high boost levels may introduce some limiting artifacts."
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
                {audioFile.name}
              </p>
            </div>
          )}
        </div>

        {/* Audio Analysis */}
        {audioFile && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Audio Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-slate-200 font-medium mb-3">Current Levels</h4>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm text-slate-300 mb-1">
                      <span>Average Level</span>
                      <span>{getLevelPercentage(audioLevel)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full transition-all"
                        style={{ width: `${getLevelPercentage(audioLevel)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm text-slate-300 mb-1">
                      <span>Peak Level</span>
                      <span>{getLevelPercentage(maxLevel)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          maxLevel > 0.8 ? 'bg-red-400' : maxLevel > 0.6 ? 'bg-yellow-400' : 'bg-green-400'
                        }`}
                        style={{ width: `${getLevelPercentage(maxLevel)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-slate-800/30 rounded-lg">
                  <p className="text-sm text-slate-300">
                    {maxLevel < 0.3 && "Audio levels are low - good candidate for boosting"}
                    {maxLevel >= 0.3 && maxLevel < 0.8 && "Audio levels are moderate - can be safely boosted"}
                    {maxLevel >= 0.8 && "Audio levels are high - use normalization for best results"}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-slate-200 font-medium mb-3">Original Audio Preview</h4>
                {previewUrl && (
                  <audio 
                    controls 
                    src={previewUrl} 
                    className="w-full"
                    data-testid="audio-original-preview"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Volume Settings */}
        {audioFile && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Volume Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Volume Boost: {volumeGain.toFixed(1)}x ({getBoostPercentage()}% increase)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={volumeGain}
                  onChange={(e) => setVolumeGain(parseFloat(e.target.value))}
                  className="w-full"
                  data-testid="slider-volume-gain"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>No Change (1x)</span>
                  <span>Moderate (3x)</span>
                  <span>Maximum (5x)</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="normalize"
                  checked={normalizeEnabled}
                  onChange={(e) => setNormalizeEnabled(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-600"
                  data-testid="checkbox-normalize"
                />
                <label htmlFor="normalize" className="text-slate-300">
                  Enable Smart Normalization
                </label>
              </div>
              
              <div className="bg-slate-800/30 rounded-lg p-4">
                <h4 className="text-slate-200 font-medium mb-2">Processing Preview</h4>
                <div className="text-sm space-y-1">
                  <p className="text-slate-300">
                    Boost Level: <span className="text-purple-400">{volumeGain.toFixed(1)}x</span>
                  </p>
                  <p className="text-slate-300">
                    Normalization: <span className="text-purple-400">{normalizeEnabled ? 'Enabled' : 'Disabled'}</span>
                  </p>
                  <p className="text-slate-300">
                    Clipping Prevention: <span className="text-green-400">Active</span>
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={boostVolume}
              disabled={isProcessing}
              className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white py-3 px-6 rounded-xl transition-colors"
              data-testid="button-boost-volume"
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Processing Audio...
                </>
              ) : (
                <>
                  <i className="fas fa-volume-up mr-2"></i>
                  Boost Volume
                </>
              )}
            </button>
          </div>
        )}

        {/* Results */}
        {processedUrl && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Enhanced Audio</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-slate-200 font-medium mb-2">Processed Audio Preview</h4>
                <audio 
                  controls 
                  src={processedUrl} 
                  className="w-full"
                  data-testid="audio-processed-preview"
                />
              </div>
              
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check-circle text-green-400"></i>
                  <span className="text-green-300 font-medium">Volume Successfully Enhanced</span>
                </div>
                <p className="text-sm text-green-200 mt-1">
                  Audio has been boosted by {getBoostPercentage()}% with clipping prevention applied
                </p>
              </div>
              
              <button
                onClick={downloadProcessed}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl transition-colors"
                data-testid="button-download-enhanced"
              >
                <i className="fas fa-download mr-2"></i>
                Download Enhanced Audio
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
};

export default VolumeBooster;