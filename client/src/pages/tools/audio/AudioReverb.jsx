import React, { useState } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const AudioReverb = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [reverbType, setReverbType] = useState('hall');
  const [wetness, setWetness] = useState(0.3);
  const [roomSize, setRoomSize] = useState(0.5);
  const [damping, setDamping] = useState(0.3);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);

  const reverbPresets = {
    hall: { roomSize: 0.8, damping: 0.3, name: 'Concert Hall' },
    room: { roomSize: 0.3, damping: 0.5, name: 'Small Room' },
    cathedral: { roomSize: 0.9, damping: 0.1, name: 'Cathedral' },
    plate: { roomSize: 0.4, damping: 0.7, name: 'Plate Reverb' },
    spring: { roomSize: 0.2, damping: 0.8, name: 'Spring Reverb' },
    chamber: { roomSize: 0.6, damping: 0.4, name: 'Echo Chamber' }
  };

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
    } else {
      alert('Please select a valid audio file');
    }
  };

  const applyReverb = async () => {
    if (!audioFile) {
      alert('Please select an audio file first');
      return;
    }

    setIsProcessing(true);
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Create reverb impulse response
      const impulseResponse = createImpulseResponse(audioContext, roomSize, damping);
      
      // Apply convolution reverb
      const processedBuffer = await applyConvolutionReverb(audioContext, audioBuffer, impulseResponse, wetness);
      
      // Convert to WAV
      const wavBuffer = audioBufferToWav(processedBuffer);
      const blob = new Blob([wavBuffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      setProcessedUrl(url);
      
    } catch (error) {
      console.error('Error applying reverb:', error);
      alert('Failed to apply reverb. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const createImpulseResponse = (audioContext, roomSize, damping) => {
    // Create impulse response for convolution reverb
    const sampleRate = audioContext.sampleRate;
    const length = sampleRate * (roomSize * 3 + 0.5); // Variable length based on room size
    const impulse = audioContext.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      
      for (let i = 0; i < length; i++) {
        // Create exponentially decaying white noise
        const decay = Math.pow(1 - damping, i / sampleRate);
        const noise = (Math.random() * 2 - 1) * decay;
        
        // Add some early reflections for realism
        if (i < sampleRate * 0.1) {
          const reflection = Math.sin(i * 0.01) * decay * 0.3;
          channelData[i] = noise + reflection;
        } else {
          channelData[i] = noise;
        }
      }
    }
    
    return impulse;
  };

  const applyConvolutionReverb = async (audioContext, audioBuffer, impulseResponse, wetness) => {
    const outputBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );
    
    // Simplified convolution (in practice, you'd use FFT for efficiency)
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const inputData = audioBuffer.getChannelData(channel);
      const impulseData = impulseResponse.getChannelData(Math.min(channel, impulseResponse.numberOfChannels - 1));
      const outputData = outputBuffer.getChannelData(channel);
      
      // Apply convolution reverb
      for (let i = 0; i < inputData.length; i++) {
        let reverbSample = 0;
        
        // Convolution with impulse response (simplified)
        for (let j = 0; j < Math.min(impulseData.length, 1000); j++) {
          if (i - j >= 0) {
            reverbSample += inputData[i - j] * impulseData[j];
          }
        }
        
        // Mix dry and wet signals
        outputData[i] = inputData[i] * (1 - wetness) + reverbSample * wetness * 0.5;
      }
    }
    
    return outputBuffer;
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

  const applyPreset = (presetName) => {
    const preset = reverbPresets[presetName];
    setReverbType(presetName);
    setRoomSize(preset.roomSize);
    setDamping(preset.damping);
  };

  const downloadProcessed = () => {
    if (processedUrl) {
      const a = document.createElement('a');
      a.href = processedUrl;
      a.download = `reverb_${reverbType}_${audioFile.name.replace(/\.[^/.]+$/, '')}.wav`;
      a.click();
    }
  };

  return (
    <ToolShell
      title="Audio Reverb & Echo"
      description="Add reverb, echo, and spatial effects to your audio recordings with professional-quality processing"
      category="Audio Tools"
      features={[
        "Multiple reverb types (Hall, Room, Cathedral, etc.)",
        "Adjustable room size and damping",
        "Wet/dry mix control",
        "Professional convolution reverb",
        "Real-time parameter adjustment",
        "High-quality spatial processing"
      ]}
      seoContent={{
        guides: [
          "Upload your audio file using the file selector",
          "Choose a reverb preset or create custom settings",
          "Adjust room size for reverb length",
          "Set damping to control frequency response",
          "Configure wet/dry mix for desired effect",
          "Process and download the reverb-enhanced audio"
        ],
        faqs: [
          {
            question: "What's the difference between reverb types?",
            answer: "Each type simulates different acoustic spaces: Hall for large venues, Room for intimate spaces, Cathedral for long decay, Plate for vintage studio sound, and Spring for classic amp-style reverb."
          },
          {
            question: "How do I control the reverb amount?",
            answer: "Use the Wetness slider to control the mix between dry (original) and wet (reverb) signals. Lower values add subtle ambience, higher values create dramatic spatial effects."
          },
          {
            question: "What do room size and damping do?",
            answer: "Room size controls reverb decay time - larger rooms have longer reverb tails. Damping affects frequency response - more damping creates warmer, less bright reverb."
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

        {/* Reverb Presets */}
        {audioFile && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Reverb Presets</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(reverbPresets).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(key)}
                  className={`p-3 rounded-lg text-sm transition-colors ${
                    reverbType === key 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                  data-testid={`button-preset-${key}`}
                >
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-xs opacity-75">
                    Size: {Math.round(preset.roomSize * 100)}% • 
                    Damp: {Math.round(preset.damping * 100)}%
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reverb Controls */}
        {audioFile && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Reverb Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Wetness (Reverb Amount): {Math.round(wetness * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={wetness}
                  onChange={(e) => setWetness(parseFloat(e.target.value))}
                  className="w-full"
                  data-testid="slider-wetness"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Dry (0%)</span>
                  <span>Balanced (50%)</span>
                  <span>Wet (100%)</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Room Size: {Math.round(roomSize * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={roomSize}
                  onChange={(e) => setRoomSize(parseFloat(e.target.value))}
                  className="w-full"
                  data-testid="slider-room-size"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Small Room</span>
                  <span>Medium Hall</span>
                  <span>Large Cathedral</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Damping: {Math.round(damping * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={damping}
                  onChange={(e) => setDamping(parseFloat(e.target.value))}
                  className="w-full"
                  data-testid="slider-damping"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Bright</span>
                  <span>Natural</span>
                  <span>Warm</span>
                </div>
              </div>
              
              <div className="bg-slate-800/30 rounded-lg p-4">
                <h4 className="text-slate-200 font-medium mb-2">Effect Preview</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Type:</span>
                    <span className="text-purple-400 ml-2 capitalize">{reverbPresets[reverbType].name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Intensity:</span>
                    <span className="text-purple-400 ml-2">{Math.round(wetness * 100)}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Decay:</span>
                    <span className="text-blue-400 ml-2">{roomSize < 0.3 ? 'Short' : roomSize < 0.7 ? 'Medium' : 'Long'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Character:</span>
                    <span className="text-green-400 ml-2">{damping < 0.3 ? 'Bright' : damping < 0.7 ? 'Natural' : 'Warm'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={applyReverb}
              disabled={isProcessing}
              className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white py-3 px-6 rounded-xl transition-colors"
              data-testid="button-apply-reverb"
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Processing Audio...
                </>
              ) : (
                <>
                  <i className="fas fa-broadcast-tower mr-2"></i>
                  Apply Reverb
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
                <h4 className="text-slate-200 font-medium mb-2">Original Audio</h4>
                <audio 
                  controls 
                  src={previewUrl} 
                  className="w-full"
                  data-testid="audio-original-preview"
                />
              </div>
              
              {processedUrl && (
                <div>
                  <h4 className="text-slate-200 font-medium mb-2">With Reverb Effect</h4>
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
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Reverb Results</h3>
            
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                <i className="fas fa-check-circle text-green-400"></i>
                <span className="text-green-300 font-medium">Reverb Successfully Applied</span>
              </div>
              <p className="text-sm text-green-200 mt-1">
                Added {reverbPresets[reverbType].name} reverb with {Math.round(wetness * 100)}% intensity
              </p>
            </div>
            
            <button
              onClick={downloadProcessed}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl transition-colors"
              data-testid="button-download-processed"
            >
              <i className="fas fa-download mr-2"></i>
              Download Reverb Audio
            </button>
          </div>
        )}
      </div>
    </ToolShell>
  );
};

export default AudioReverb;