import React, { useState, useRef, useEffect } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const VoiceRecorder = ({ tool }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isPlaying, setIsPlaying] = useState({});
  
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const analyzerRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    return () => {
      stopRecording();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;
      
      // Setup audio visualization
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyzerRef.current = audioContextRef.current.createAnalyser();
      analyzerRef.current.fftSize = 256;
      source.connect(analyzerRef.current);
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const newRecording = {
          id: Date.now(),
          url,
          blob,
          duration: recordingTime,
          name: `Recording_${new Date().toLocaleTimeString()}`,
          timestamp: new Date().toLocaleString()
        };
        setRecordings(prev => [...prev, newRecording]);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer and visualization
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        visualizeAudio();
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        intervalRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
          visualizeAudio();
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        clearInterval(intervalRef.current);
      }
      setIsPaused(!isPaused);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      clearInterval(intervalRef.current);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      setAudioLevel(0);
    }
  };

  const visualizeAudio = () => {
    if (!analyzerRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
    
    analyzerRef.current.getByteFrequencyData(dataArray);
    
    // Calculate average amplitude
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    setAudioLevel(average);
    
    // Draw waveform
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = canvas.width / dataArray.length;
    let x = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height;
      
      const red = Math.floor((dataArray[i] / 255) * 255);
      const green = Math.floor((1 - dataArray[i] / 255) * 255);
      const blue = 100;
      
      ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      
      x += barWidth;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadRecording = (recording) => {
    const a = document.createElement('a');
    a.href = recording.url;
    a.download = `${recording.name}.webm`;
    a.click();
  };

  const deleteRecording = (id) => {
    setRecordings(prev => {
      const recording = prev.find(r => r.id === id);
      if (recording) {
        URL.revokeObjectURL(recording.url);
      }
      return prev.filter(r => r.id !== id);
    });
  };

  const togglePlayback = (recording) => {
    const audio = new Audio(recording.url);
    const recordingId = recording.id;
    
    if (isPlaying[recordingId]) {
      audio.pause();
      setIsPlaying(prev => ({ ...prev, [recordingId]: false }));
    } else {
      audio.play();
      setIsPlaying(prev => ({ ...prev, [recordingId]: true }));
      
      audio.onended = () => {
        setIsPlaying(prev => ({ ...prev, [recordingId]: false }));
      };
    }
  };

  return (
    <ToolShell
      tool={tool}
      title="Professional Voice Recorder"
      description="Record high-quality audio directly from your microphone with real-time visualization and professional controls"
      category="Audio Tools"
      features={[
        "High-quality audio recording",
        "Real-time audio visualization",
        "Pause and resume recording",
        "Multiple recording management",
        "Instant playback and download",
        "Browser-based, no installation needed"
      ]}
      seoContent={{
        guides: [
          "Click 'Start Recording' to begin capturing audio",
          "Use pause/resume controls during recording",
          "Monitor audio levels with the visual meter",
          "Stop recording when finished",
          "Play back, download, or delete recordings"
        ],
        faqs: [
          {
            question: "What audio quality does the recorder provide?",
            answer: "Our voice recorder captures audio at 44.1kHz sample rate with noise suppression and echo cancellation for professional quality results."
          },
          {
            question: "How long can I record for?",
            answer: "Recording length is limited by your device's available storage. Most devices can handle hours of continuous recording."
          },
          {
            question: "Can I record without an internet connection?",
            answer: "Yes! Once the page loads, the voice recorder works completely offline using your browser's built-in capabilities."
          }
        ]
      }}
    >
      <div className="space-y-6">
        {/* Recording Controls */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-xl font-semibold text-slate-100 mb-6">Recording Controls</h3>
          
          {/* Audio Visualization */}
          <div className="mb-6">
            <canvas
              ref={canvasRef}
              width="400"
              height="100"
              className="w-full h-24 bg-slate-800 rounded-lg border border-slate-600"
              data-testid="audio-visualizer"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-slate-400">Audio Level</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${(audioLevel / 255) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-slate-400">{Math.round((audioLevel / 255) * 100)}%</span>
              </div>
            </div>
          </div>
          
          {/* Timer */}
          <div className="text-center mb-6">
            <div className="text-4xl font-mono text-purple-400 mb-2" data-testid="recording-timer">
              {formatTime(recordingTime)}
            </div>
            <div className="flex items-center justify-center space-x-2">
              {isRecording && (
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              )}
              <span className="text-slate-300">
                {isRecording ? (isPaused ? 'Paused' : 'Recording') : 'Ready to Record'}
              </span>
            </div>
          </div>
          
          {/* Control Buttons */}
          <div className="flex justify-center space-x-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="bg-red-600 hover:bg-red-700 text-white py-3 px-8 rounded-xl transition-colors"
                data-testid="button-start-recording"
              >
                <i className="fas fa-microphone mr-2"></i>
                Start Recording
              </button>
            ) : (
              <>
                <button
                  onClick={pauseRecording}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-6 rounded-xl transition-colors"
                  data-testid="button-pause-recording"
                >
                  <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'} mr-2`}></i>
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
                <button
                  onClick={stopRecording}
                  className="bg-slate-600 hover:bg-slate-700 text-white py-3 px-6 rounded-xl transition-colors"
                  data-testid="button-stop-recording"
                >
                  <i className="fas fa-stop mr-2"></i>
                  Stop
                </button>
              </>
            )}
          </div>
        </div>

        {/* Recordings List */}
        {recordings.length > 0 && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">
              Recordings ({recordings.length})
            </h3>
            
            <div className="space-y-3">
              {recordings.map((recording) => (
                <div key={recording.id} className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-slate-200 font-medium">{recording.name}</h4>
                      <p className="text-sm text-slate-400">
                        Duration: {formatTime(recording.duration)} • {recording.timestamp}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => togglePlayback(recording)}
                        className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors"
                        data-testid={`button-play-${recording.id}`}
                      >
                        <i className={`fas ${isPlaying[recording.id] ? 'fa-pause' : 'fa-play'}`}></i>
                      </button>
                      
                      <button
                        onClick={() => downloadRecording(recording)}
                        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
                        data-testid={`button-download-${recording.id}`}
                      >
                        <i className="fas fa-download"></i>
                      </button>
                      
                      <button
                        onClick={() => deleteRecording(recording.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                        data-testid={`button-delete-${recording.id}`}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
};

export default VoiceRecorder;