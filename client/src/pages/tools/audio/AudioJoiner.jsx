import React, { useState, useRef } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const AudioJoiner = ({ tool }) => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [crossfadeEnabled, setCrossfadeEnabled] = useState(false);
  const [crossfadeDuration, setCrossfadeDuration] = useState(2);
  const [gapDuration, setGapDuration] = useState(0);
  const [outputUrl, setOutputUrl] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => file.type.startsWith('audio/'));
    
    if (validFiles.length !== files.length) {
      alert('Some files were skipped because they are not audio files');
    }
    
    const newFiles = validFiles.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      size: file.size,
      duration: 0,
      url: URL.createObjectURL(file)
    }));
    
    // Get duration for each file
    newFiles.forEach(audioFile => {
      const audio = new Audio();
      audio.src = audioFile.url;
      audio.addEventListener('loadedmetadata', () => {
        setAudioFiles(prev => prev.map(f => 
          f.id === audioFile.id ? { ...f, duration: audio.duration } : f
        ));
      });
    });
    
    setAudioFiles(prev => [...prev, ...newFiles]);
    event.target.value = '';
  };

  const removeFile = (id) => {
    setAudioFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.url);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const moveFile = (fromIndex, toIndex) => {
    setAudioFiles(prev => {
      const newFiles = [...prev];
      const [movedFile] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedFile);
      return newFiles;
    });
  };

  const joinAudio = async () => {
    if (audioFiles.length < 2) {
      alert('Please add at least 2 audio files to join');
      return;
    }

    setIsProcessing(true);
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffers = [];
      
      // Load all audio files
      for (const audioFile of audioFiles) {
        const arrayBuffer = await audioFile.file.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        audioBuffers.push(audioBuffer);
      }
      
      // Calculate total duration
      let totalDuration = 0;
      audioBuffers.forEach((buffer, index) => {
        totalDuration += buffer.duration;
        if (index < audioBuffers.length - 1) {
          if (crossfadeEnabled) {
            totalDuration -= crossfadeDuration;
          } else {
            totalDuration += gapDuration;
          }
        }
      });
      
      // Create output buffer
      const sampleRate = audioBuffers[0].sampleRate;
      const channels = Math.max(...audioBuffers.map(b => b.numberOfChannels));
      const outputLength = Math.floor(totalDuration * sampleRate);
      const outputBuffer = audioContext.createBuffer(channels, outputLength, sampleRate);
      
      // Join audio buffers
      let currentOffset = 0;
      
      for (let i = 0; i < audioBuffers.length; i++) {
        const buffer = audioBuffers[i];
        const nextBuffer = i < audioBuffers.length - 1 ? audioBuffers[i + 1] : null;
        
        for (let channel = 0; channel < channels; channel++) {
          const outputData = outputBuffer.getChannelData(channel);
          const inputData = buffer.getChannelData(Math.min(channel, buffer.numberOfChannels - 1));
          
          // Copy main audio
          let copyLength = buffer.length;
          if (crossfadeEnabled && nextBuffer) {
            copyLength -= Math.floor(crossfadeDuration * sampleRate);
          }
          
          for (let j = 0; j < copyLength && currentOffset + j < outputLength; j++) {
            outputData[currentOffset + j] = inputData[j];
          }
          
          // Handle crossfade
          if (crossfadeEnabled && nextBuffer) {
            const fadeLength = Math.floor(crossfadeDuration * sampleRate);
            const nextInputData = nextBuffer.getChannelData(Math.min(channel, nextBuffer.numberOfChannels - 1));
            
            for (let j = 0; j < fadeLength && currentOffset + copyLength + j < outputLength; j++) {
              const fadeIn = j / fadeLength;
              const fadeOut = 1 - fadeIn;
              
              const currentSample = j < buffer.length - copyLength ? inputData[copyLength + j] * fadeOut : 0;
              const nextSample = j < nextInputData.length ? nextInputData[j] * fadeIn : 0;
              
              outputData[currentOffset + copyLength + j] = currentSample + nextSample;
            }
          }
        }
        
        // Update offset
        currentOffset += buffer.length;
        if (crossfadeEnabled && nextBuffer) {
          currentOffset -= Math.floor(crossfadeDuration * sampleRate);
        } else if (!crossfadeEnabled && nextBuffer) {
          currentOffset += Math.floor(gapDuration * sampleRate);
        }
      }
      
      // Convert to WAV
      const wavBuffer = audioBufferToWav(outputBuffer);
      const blob = new Blob([wavBuffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      setOutputUrl(url);
      
      // Auto download
      const a = document.createElement('a');
      a.href = url;
      a.download = `joined_audio_${Date.now()}.wav`;
      a.click();
      
    } catch (error) {
      console.error('Error joining audio:', error);
      alert('Failed to join audio files. Please try again.');
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTotalDuration = () => {
    return audioFiles.reduce((total, file) => total + (file.duration || 0), 0);
  };

  return (
    <ToolShell
      tool={tool}
      title="Audio Joiner & Merger"
      description="Combine multiple audio files into one with crossfade effects, gap control, and professional audio merging capabilities"
      category="Audio Tools"
      features={[
        "Join unlimited audio files",
        "Crossfade transitions",
        "Customizable gap insertion",
        "Drag and drop reordering",
        "Multiple format support",
        "High-quality output"
      ]}
      seoContent={{
        guides: [
          "Upload multiple audio files using the file selector",
          "Arrange files in your desired order by dragging",
          "Configure crossfade or gap settings between tracks",
          "Preview the arrangement and total duration",
          "Click 'Join Audio' to merge and download"
        ],
        faqs: [
          {
            question: "What audio formats can I join?",
            answer: "You can join MP3, WAV, OGG, M4A, and most common audio formats. The output is provided in high-quality WAV format for maximum compatibility."
          },
          {
            question: "How many files can I join at once?",
            answer: "There's no strict limit, but for optimal performance we recommend joining up to 50 files at once. Very large numbers of files may take longer to process."
          },
          {
            question: "What's the difference between crossfade and gap?",
            answer: "Crossfade creates a smooth transition by gradually fading out one track while fading in the next. Gap adds silence between tracks for clear separation."
          }
        ]
      }}
    >
      <div className="space-y-6">
        {/* File Upload */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-xl font-semibold text-slate-100 mb-4">Add Audio Files</h3>
          
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              data-testid="input-audio-files"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-full cursor-pointer focus:outline-none"
            >
              <i className="fas fa-cloud-upload-alt text-4xl text-slate-400 mb-4"></i>
              <p className="text-slate-300">Click to select audio files</p>
              <p className="text-sm text-slate-500 mt-2">MP3, WAV, OGG, M4A supported • Multiple files allowed</p>
            </button>
          </div>
        </div>

        {/* Audio Files List */}
        {audioFiles.length > 0 && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">
              Audio Files ({audioFiles.length})
            </h3>
            
            <div className="space-y-3">
              {audioFiles.map((audioFile, index) => (
                <div key={audioFile.id} className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center space-y-1">
                        <button
                          onClick={() => index > 0 && moveFile(index, index - 1)}
                          disabled={index === 0}
                          className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-50"
                          data-testid={`button-move-up-${index}`}
                        >
                          <i className="fas fa-chevron-up"></i>
                        </button>
                        <span className="text-sm text-slate-400">{index + 1}</span>
                        <button
                          onClick={() => index < audioFiles.length - 1 && moveFile(index, index + 1)}
                          disabled={index === audioFiles.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-50"
                          data-testid={`button-move-down-${index}`}
                        >
                          <i className="fas fa-chevron-down"></i>
                        </button>
                      </div>
                      
                      <div>
                        <h4 className="text-slate-200 font-medium">{audioFile.name}</h4>
                        <p className="text-sm text-slate-400">
                          {formatFileSize(audioFile.size)} • 
                          {audioFile.duration ? ` ${formatTime(audioFile.duration)}` : ' Loading...'}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeFile(audioFile.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                      data-testid={`button-remove-${index}`}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-slate-800/30 rounded-lg">
              <p className="text-slate-300">
                Total Duration: {formatTime(getTotalDuration())}
              </p>
            </div>
          </div>
        )}

        {/* Join Settings */}
        {audioFiles.length > 1 && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Join Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="crossfade"
                  checked={crossfadeEnabled}
                  onChange={(e) => setCrossfadeEnabled(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-600"
                  data-testid="checkbox-crossfade"
                />
                <label htmlFor="crossfade" className="text-slate-300">
                  Enable Crossfade Transitions
                </label>
              </div>
              
              {crossfadeEnabled ? (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Crossfade Duration: {crossfadeDuration}s
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={crossfadeDuration}
                    onChange={(e) => setCrossfadeDuration(parseFloat(e.target.value))}
                    className="w-full"
                    data-testid="slider-crossfade-duration"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>0.5s</span>
                    <span>5s</span>
                    <span>10s</span>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Gap Between Files: {gapDuration}s
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={gapDuration}
                    onChange={(e) => setGapDuration(parseFloat(e.target.value))}
                    className="w-full"
                    data-testid="slider-gap-duration"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>No Gap</span>
                    <span>5s</span>
                    <span>10s</span>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={joinAudio}
              disabled={isProcessing || audioFiles.length < 2}
              className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white py-3 px-6 rounded-xl transition-colors"
              data-testid="button-join-audio"
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Joining Audio...
                </>
              ) : (
                <>
                  <i className="fas fa-link mr-2"></i>
                  Join Audio Files
                </>
              )}
            </button>
          </div>
        )}

        {/* Output Preview */}
        {outputUrl && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Joined Audio</h3>
            <audio controls src={outputUrl} className="w-full" data-testid="audio-output-preview" />
          </div>
        )}
      </div>
    </ToolShell>
  );
};

export default AudioJoiner;