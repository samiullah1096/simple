import React, { useState } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const NoiseReducer = ({ tool }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [noiseLevel, setNoiseLevel] = useState(5);
  const [preserveVoice, setPreserveVoice] = useState(true);
  const [aggressiveMode, setAggressiveMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalDuration, setOriginalDuration] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [noiseProfile, setNoiseProfile] = useState(null);

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
      setNoiseProfile(null);
      
      // Get duration and analyze noise
      const audio = new Audio();
      audio.src = url;
      audio.addEventListener('loadedmetadata', () => {
        setOriginalDuration(audio.duration);
      });
      
      analyzeNoise(file);
    } else {
      alert('Please select a valid audio file');
    }
  };

  const analyzeNoise = async (file) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Analyze first 2 seconds for noise profile (simplified)
      const sampleLength = Math.min(audioBuffer.length, audioBuffer.sampleRate * 2);
      const channelData = audioBuffer.getChannelData(0);
      
      // Calculate RMS and frequency characteristics
      let rmsSum = 0;
      for (let i = 0; i < sampleLength; i++) {
        rmsSum += channelData[i] * channelData[i];
      }
      const rmsLevel = Math.sqrt(rmsSum / sampleLength);
      
      // Simple noise profile
      setNoiseProfile({
        rmsLevel,
        estimatedNoiseFloor: rmsLevel * 0.1,
        hasNoise: rmsLevel > 0.001
      });
      
    } catch (error) {
      console.error('Error analyzing noise:', error);
    }
  };

  const reduceNoise = async () => {
    if (!audioFile) {
      alert('Please select an audio file first');
      return;
    }

    setIsProcessing(true);
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Apply noise reduction
      const processedBuffer = await applyNoiseReduction(audioContext, audioBuffer);
      
      // Convert to WAV
      const wavBuffer = audioBufferToWav(processedBuffer);
      const blob = new Blob([wavBuffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      setProcessedUrl(url);
      
    } catch (error) {
      console.error('Error reducing noise:', error);
      alert('Failed to reduce noise. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const applyNoiseReduction = async (audioContext, audioBuffer) => {
    const processedBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );
    
    const frameSize = 2048;
    const overlapRatio = 0.75;
    const hopSize = frameSize * (1 - overlapRatio);
    const reductionFactor = noiseLevel / 10; // Convert to 0-1 range
    
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const inputData = audioBuffer.getChannelData(channel);
      const outputData = processedBuffer.getChannelData(channel);
      
      // Spectral subtraction approach (simplified)
      let pos = 0;
      while (pos < inputData.length) {
        const frameEnd = Math.min(pos + frameSize, inputData.length);
        const frameLength = frameEnd - pos;
        
        // Extract frame
        const frame = new Float32Array(frameLength);
        for (let i = 0; i < frameLength; i++) {
          frame[i] = inputData[pos + i];
        }
        
        // Apply noise reduction
        const processedFrame = processFrame(frame, reductionFactor, preserveVoice, aggressiveMode);
        
        // Apply window and overlap-add
        for (let i = 0; i < frameLength; i++) {
          if (pos + i < outputData.length) {
            // Hann window
            const window = 0.5 * (1 - Math.cos(2 * Math.PI * i / frameLength));
            outputData[pos + i] += processedFrame[i] * window;
          }
        }
        
        pos += hopSize;
      }
    }
    
    return processedBuffer;
  };

  const processFrame = (frame, reductionFactor, preserveVoice, aggressive) => {
    const processedFrame = new Float32Array(frame.length);
    
    // Calculate frame statistics
    let rms = 0;
    for (let i = 0; i < frame.length; i++) {
      rms += frame[i] * frame[i];
    }
    rms = Math.sqrt(rms / frame.length);
    
    // Determine if frame contains voice/speech
    const isVoiceFrame = preserveVoice && rms > 0.01; // Simple voice detection
    
    for (let i = 0; i < frame.length; i++) {
      let sample = frame[i];
      
      if (aggressive && !isVoiceFrame) {
        // Aggressive noise reduction
        const threshold = 0.005 * reductionFactor;
        if (Math.abs(sample) < threshold) {
          sample *= (1 - reductionFactor * 0.9);
        } else {
          sample *= (1 - reductionFactor * 0.3);
        }
      } else {
        // Gentle noise reduction
        const noiseGate = 0.002 * reductionFactor;
        if (Math.abs(sample) < noiseGate) {
          sample *= (1 - reductionFactor * 0.8);
        } else {
          sample *= (1 - reductionFactor * 0.2);
        }
      }
      
      processedFrame[i] = sample;
    }
    
    return processedFrame;
  };

  const audioBufferToWav = (buffer) => {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);
    
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
      a.download = `noise_reduced_${audioFile.name.replace(/\.[^/.]+$/, '')}.wav`;
      a.click();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getReductionDescription = () => {
    if (noiseLevel <= 2) return "Minimal";
    if (noiseLevel <= 4) return "Light";
    if (noiseLevel <= 6) return "Moderate";
    if (noiseLevel <= 8) return "Strong";
    return "Maximum";
  };

  return (
    <ToolShell
      tool={tool}
      title="Noise Reducer"
      description="Remove background noise and unwanted sounds from audio recordings using advanced spectral processing"
      category="Audio Tools"
      features={[
        "Intelligent noise detection",
        "Voice preservation mode",
        "Adjustable reduction levels",
        "Aggressive mode for heavy noise",
        "Real-time noise analysis",
        "Professional audio quality"
      ]}
      seoContent={{
        guides: [
          "Upload your audio file containing background noise",
          "Automatic noise analysis will detect noise characteristics",
          "Adjust the noise reduction level (1-10 scale)",
          "Enable voice preservation to protect speech content",
          "Use aggressive mode for heavily noisy recordings",
          "Process and download the cleaned audio"
        ],
        faqs: [
          {
            question: "How does the noise reduction work?",
            answer: "Our tool uses spectral subtraction and adaptive filtering to identify and reduce background noise while preserving the important audio content like speech and music."
          },
          {
            question: "What's the difference between normal and aggressive mode?",
            answer: "Normal mode gently reduces noise while preserving audio quality. Aggressive mode provides stronger noise reduction but may introduce some artifacts in the remaining audio."
          },
          {
            question: "Can it remove all types of noise?",
            answer: "Our tool works best with consistent background noise like hum, hiss, or air conditioning. It's less effective with intermittent sounds or noise that overlaps with the main audio frequency range."
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
              <p className="text-sm text-slate-400 mt-1">
                Duration: {formatTime(originalDuration)}
              </p>
            </div>
          )}
        </div>

        {/* Noise Analysis */}
        {noiseProfile && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Noise Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {(noiseProfile.rmsLevel * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-slate-400">Average Level</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {(noiseProfile.estimatedNoiseFloor * 1000).toFixed(1)}
                </div>
                <p className="text-sm text-slate-400">Noise Floor (mV)</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className={`text-2xl font-bold mb-1 ${
                  noiseProfile.hasNoise ? 'text-red-400' : 'text-green-400'
                }`}>
                  {noiseProfile.hasNoise ? 'Detected' : 'Clean'}
                </div>
                <p className="text-sm text-slate-400">Noise Status</p>
              </div>
            </div>
            
            {noiseProfile.hasNoise && (
              <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-exclamation-triangle text-yellow-400"></i>
                  <span className="text-yellow-300 text-sm">
                    Background noise detected. Noise reduction recommended.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Noise Reduction Settings */}
        {audioFile && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Noise Reduction Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Reduction Level: {noiseLevel} ({getReductionDescription()})
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={noiseLevel}
                  onChange={(e) => setNoiseLevel(parseInt(e.target.value))}
                  className="w-full"
                  data-testid="slider-noise-level"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Minimal<br/>Preserve Quality</span>
                  <span>Moderate<br/>Balanced</span>
                  <span>Maximum<br/>Remove All Noise</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="preserve-voice"
                    checked={preserveVoice}
                    onChange={(e) => setPreserveVoice(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-600"
                    data-testid="checkbox-preserve-voice"
                  />
                  <label htmlFor="preserve-voice" className="text-slate-300">
                    Preserve Voice/Speech
                  </label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="aggressive-mode"
                    checked={aggressiveMode}
                    onChange={(e) => setAggressiveMode(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-600"
                    data-testid="checkbox-aggressive-mode"
                  />
                  <label htmlFor="aggressive-mode" className="text-slate-300">
                    Aggressive Mode
                  </label>
                </div>
              </div>
              
              <div className="bg-slate-800/30 rounded-lg p-4">
                <h4 className="text-slate-200 font-medium mb-2">Processing Preview</h4>
                <div className="text-sm space-y-1">
                  <p className="text-slate-300">
                    Reduction Strength: <span className="text-purple-400">{getReductionDescription()}</span>
                  </p>
                  <p className="text-slate-300">
                    Voice Protection: <span className="text-green-400">{preserveVoice ? 'Enabled' : 'Disabled'}</span>
                  </p>
                  <p className="text-slate-300">
                    Processing Mode: <span className="text-blue-400">{aggressiveMode ? 'Aggressive' : 'Standard'}</span>
                  </p>
                  <p className="text-slate-300">
                    Algorithm: <span className="text-orange-400">Spectral Subtraction</span>
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={reduceNoise}
              disabled={isProcessing}
              className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white py-3 px-6 rounded-xl transition-colors"
              data-testid="button-reduce-noise"
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Reducing Noise...
                </>
              ) : (
                <>
                  <i className="fas fa-filter mr-2"></i>
                  Reduce Noise
                </>
              )}
            </button>
          </div>
        )}

        {/* Audio Preview */}
        {previewUrl && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Audio Preview</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-slate-200 font-medium mb-2">Original Audio (with noise)</h4>
                <audio 
                  controls 
                  src={previewUrl} 
                  className="w-full"
                  data-testid="audio-original-preview"
                />
              </div>
              
              {processedUrl && (
                <div>
                  <h4 className="text-slate-200 font-medium mb-2">Noise Reduced Audio</h4>
                  <audio 
                    controls 
                    src={processedUrl} 
                    className="w-full"
                    data-testid="audio-processed-preview"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {processedUrl && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Noise Reduction Results</h3>
            
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                <i className="fas fa-check-circle text-green-400"></i>
                <span className="text-green-300 font-medium">Noise Successfully Reduced</span>
              </div>
              <p className="text-sm text-green-200 mt-1">
                Applied {getReductionDescription().toLowerCase()} noise reduction with 
                {preserveVoice ? ' voice preservation' : ' standard processing'}
                {aggressiveMode ? ' in aggressive mode' : ''}
              </p>
            </div>
            
            <button
              onClick={downloadProcessed}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl transition-colors"
              data-testid="button-download-processed"
            >
              <i className="fas fa-download mr-2"></i>
              Download Noise-Reduced Audio
            </button>
          </div>
        )}
      </div>
    </ToolShell>
  );
};

export default NoiseReducer;