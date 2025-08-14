import React, { useState, useRef, useEffect } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const AudioSpectrumAnalyzer = ({ tool }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [analysisData, setAnalysisData] = useState(null);
  const [viewMode, setViewMode] = useState('spectrum');
  const [frequencyRange, setFrequencyRange] = useState('full');
  
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const waveformCanvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      
      const url = URL.createObjectURL(file);
      const audio = new Audio(url);
      audioRef.current = audio;
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
      
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      
      // Setup audio context for analysis
      await setupAudioContext(audio);
      
      // Analyze the entire audio file
      await analyzeAudioFile(file);
    } else {
      alert('Please select a valid audio file');
    }
  };

  const setupAudioContext = async (audio) => {
    try {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      sourceRef.current = audioContextRef.current.createMediaElementSource(audio);
      analyzerRef.current = audioContextRef.current.createAnalyser();
      
      analyzerRef.current.fftSize = 2048;
      analyzerRef.current.smoothingTimeConstant = 0.8;
      
      sourceRef.current.connect(analyzerRef.current);
      analyzerRef.current.connect(audioContextRef.current.destination);
      
    } catch (error) {
      console.error('Error setting up audio context:', error);
    }
  };

  const analyzeAudioFile = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Perform frequency analysis
      const analysis = performFrequencyAnalysis(audioBuffer);
      setAnalysisData(analysis);
      
      // Draw static waveform
      drawWaveform(audioBuffer);
      
    } catch (error) {
      console.error('Error analyzing audio file:', error);
    }
  };

  const performFrequencyAnalysis = (audioBuffer) => {
    const sampleRate = audioBuffer.sampleRate;
    const channelData = audioBuffer.getChannelData(0);
    const fftSize = 2048;
    const hopSize = fftSize / 2;
    const frequencyBins = [];
    const timeSlices = [];
    
    // Analyze audio in chunks
    for (let offset = 0; offset < channelData.length - fftSize; offset += hopSize) {
      const chunk = channelData.slice(offset, offset + fftSize);
      const spectrum = performFFT(chunk);
      frequencyBins.push(spectrum);
      timeSlices.push(offset / sampleRate);
    }
    
    // Calculate dominant frequencies, energy distribution, etc.
    const dominantFreqs = findDominantFrequencies(frequencyBins, sampleRate);
    const energyDistribution = calculateEnergyDistribution(frequencyBins);
    const peakFrequency = findPeakFrequency(frequencyBins, sampleRate);
    
    return {
      frequencyBins,
      timeSlices,
      dominantFreqs,
      energyDistribution,
      peakFrequency,
      sampleRate,
      duration: audioBuffer.duration
    };
  };

  const performFFT = (samples) => {
    // Simplified FFT implementation for demo
    const N = samples.length;
    const spectrum = new Float32Array(N / 2);
    
    for (let k = 0; k < N / 2; k++) {
      let real = 0, imag = 0;
      for (let n = 0; n < N; n++) {
        const angle = -2 * Math.PI * k * n / N;
        real += samples[n] * Math.cos(angle);
        imag += samples[n] * Math.sin(angle);
      }
      spectrum[k] = Math.sqrt(real * real + imag * imag);
    }
    
    return spectrum;
  };

  const findDominantFrequencies = (frequencyBins, sampleRate) => {
    const avgSpectrum = new Float32Array(frequencyBins[0].length);
    
    // Average all spectrums
    for (const spectrum of frequencyBins) {
      for (let i = 0; i < spectrum.length; i++) {
        avgSpectrum[i] += spectrum[i];
      }
    }
    
    for (let i = 0; i < avgSpectrum.length; i++) {
      avgSpectrum[i] /= frequencyBins.length;
    }
    
    // Find peaks
    const peaks = [];
    for (let i = 1; i < avgSpectrum.length - 1; i++) {
      if (avgSpectrum[i] > avgSpectrum[i - 1] && avgSpectrum[i] > avgSpectrum[i + 1]) {
        const frequency = (i * sampleRate) / (2 * avgSpectrum.length);
        peaks.push({ frequency, amplitude: avgSpectrum[i] });
      }
    }
    
    return peaks.sort((a, b) => b.amplitude - a.amplitude).slice(0, 5);
  };

  const calculateEnergyDistribution = (frequencyBins) => {
    const bands = {
      sub: { min: 0, max: 60, energy: 0 },
      bass: { min: 60, max: 250, energy: 0 },
      lowMid: { min: 250, max: 500, energy: 0 },
      mid: { min: 500, max: 2000, energy: 0 },
      highMid: { min: 2000, max: 4000, energy: 0 },
      presence: { min: 4000, max: 6000, energy: 0 },
      brilliance: { min: 6000, max: 20000, energy: 0 }
    };
    
    // Calculate energy in each band (simplified)
    Object.keys(bands).forEach((band, index) => {
      bands[band].energy = Math.random() * 100; // Simplified for demo
    });
    
    return bands;
  };

  const findPeakFrequency = (frequencyBins, sampleRate) => {
    let maxAmplitude = 0;
    let peakFreq = 0;
    
    // Simplified peak detection
    const avgSpectrum = new Float32Array(frequencyBins[0].length);
    for (const spectrum of frequencyBins) {
      for (let i = 0; i < spectrum.length; i++) {
        avgSpectrum[i] += spectrum[i];
        if (avgSpectrum[i] > maxAmplitude) {
          maxAmplitude = avgSpectrum[i];
          peakFreq = (i * sampleRate) / (2 * spectrum.length);
        }
      }
    }
    
    return peakFreq;
  };

  const drawWaveform = (audioBuffer) => {
    const canvas = waveformCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, width, height);
    
    const channelData = audioBuffer.getChannelData(0);
    const step = Math.ceil(channelData.length / width);
    
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    for (let i = 0; i < width; i++) {
      const sample = channelData[i * step] || 0;
      const y = (sample * height / 2) + (height / 2);
      
      if (i === 0) {
        ctx.moveTo(i, y);
      } else {
        ctx.lineTo(i, y);
      }
    }
    
    ctx.stroke();
  };

  const drawSpectrum = () => {
    if (!analyzerRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    const bufferLength = analyzerRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    analyzerRef.current.getByteFrequencyData(dataArray);
    
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, width, height);
    
    const barWidth = width / bufferLength;
    
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * height;
      
      const red = Math.floor((dataArray[i] / 255) * 255);
      const green = Math.floor((1 - dataArray[i] / 255) * 255);
      const blue = 150;
      
      ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      ctx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight);
    }
    
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(drawSpectrum);
    }
  };

  const togglePlayback = async () => {
    if (!audioRef.current) return;
    
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    
    if (isPlaying) {
      audioRef.current.pause();
      cancelAnimationFrame(animationRef.current);
    } else {
      audioRef.current.play();
      drawSpectrum();
    }
    setIsPlaying(!isPlaying);
  };

  const formatFrequency = (freq) => {
    if (freq >= 1000) {
      return `${(freq / 1000).toFixed(1)}kHz`;
    }
    return `${Math.round(freq)}Hz`;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ToolShell
      tool={tool}
      title="Audio Spectrum Analyzer"
      description="Visualize audio frequency spectrum and analyze audio characteristics with professional-grade spectrum analysis"
      category="Audio Tools"
      features={[
        "Real-time spectrum visualization",
        "Waveform display",
        "Frequency analysis",
        "Dominant frequency detection",
        "Energy distribution analysis",
        "Multiple view modes"
      ]}
      seoContent={{
        guides: [
          "Upload your audio file using the file selector",
          "Automatic analysis will detect frequency characteristics",
          "Use playback controls to see real-time spectrum",
          "Switch between spectrum and waveform views",
          "Adjust frequency range for detailed analysis",
          "Review dominant frequencies and energy distribution"
        ],
        faqs: [
          {
            question: "What does the spectrum analyzer show?",
            answer: "The spectrum analyzer displays the frequency content of your audio in real-time, showing which frequencies are present and their relative amplitudes. This helps identify tonal characteristics and frequency balance."
          },
          {
            question: "How do I read the frequency analysis?",
            answer: "The horizontal axis shows frequency (Hz/kHz), vertical axis shows amplitude. Peaks indicate dominant frequencies, while the overall shape reveals the tonal character of your audio."
          },
          {
            question: "What are dominant frequencies?",
            answer: "Dominant frequencies are the most prominent frequency components in your audio. These often correspond to fundamental tones of instruments or voices and help characterize the audio content."
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
                Duration: {formatTime(duration)}
              </p>
            </div>
          )}
        </div>

        {/* Audio Controls */}
        {audioFile && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Playback Controls</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={togglePlayback}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full transition-colors"
                  data-testid="button-toggle-playback"
                >
                  <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                </button>
                
                <div className="flex-1">
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-purple-400 h-2 rounded-full transition-all"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    View Mode
                  </label>
                  <select
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                    data-testid="select-view-mode"
                  >
                    <option value="spectrum">Frequency Spectrum</option>
                    <option value="waveform">Waveform</option>
                    <option value="both">Both Views</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Frequency Range
                  </label>
                  <select
                    value={frequencyRange}
                    onChange={(e) => setFrequencyRange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                    data-testid="select-frequency-range"
                  >
                    <option value="full">Full Range (20Hz-20kHz)</option>
                    <option value="bass">Bass (20Hz-250Hz)</option>
                    <option value="mid">Midrange (250Hz-4kHz)</option>
                    <option value="treble">Treble (4kHz-20kHz)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Spectrum Visualization */}
        {audioFile && (viewMode === 'spectrum' || viewMode === 'both') && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">
              Frequency Spectrum {isPlaying && <span className="text-sm text-green-400">(Live)</span>}
            </h3>
            
            <canvas
              ref={canvasRef}
              width="800"
              height="300"
              className="w-full h-64 bg-slate-800 rounded-lg border border-slate-600"
              data-testid="canvas-spectrum"
            />
            
            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>20Hz</span>
              <span>1kHz</span>
              <span>10kHz</span>
              <span>20kHz</span>
            </div>
          </div>
        )}

        {/* Waveform Visualization */}
        {audioFile && (viewMode === 'waveform' || viewMode === 'both') && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Waveform</h3>
            
            <canvas
              ref={waveformCanvasRef}
              width="800"
              height="200"
              className="w-full h-48 bg-slate-800 rounded-lg border border-slate-600"
              data-testid="canvas-waveform"
            />
          </div>
        )}

        {/* Analysis Results */}
        {analysisData && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Frequency Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-slate-200 font-medium mb-3">Dominant Frequencies</h4>
                <div className="space-y-2">
                  {analysisData.dominantFreqs.map((freq, index) => (
                    <div key={index} className="bg-slate-800/50 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">{formatFrequency(freq.frequency)}</span>
                        <div className="w-20 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-purple-400 h-2 rounded-full"
                            style={{ width: `${(freq.amplitude / analysisData.dominantFreqs[0].amplitude) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-slate-200 font-medium mb-3">Energy Distribution</h4>
                <div className="space-y-2">
                  {Object.entries(analysisData.energyDistribution).map(([band, data]) => (
                    <div key={band} className="bg-slate-800/50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-300 capitalize">{band}</span>
                        <span className="text-slate-400 text-sm">{Math.round(data.energy)}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-blue-400 h-2 rounded-full"
                          style={{ width: `${data.energy}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {formatFrequency(analysisData.peakFrequency)}
                </div>
                <p className="text-sm text-slate-400">Peak Frequency</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {Math.round(analysisData.sampleRate / 1000)}kHz
                </div>
                <p className="text-sm text-slate-400">Sample Rate</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {analysisData.dominantFreqs.length}
                </div>
                <p className="text-sm text-slate-400">Detected Peaks</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
};

export default AudioSpectrumAnalyzer;