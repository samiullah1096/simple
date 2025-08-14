import React, { useState, useRef } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [audioUrl, setAudioUrl] = useState(null);
  
  const utteranceRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  React.useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, [selectedVoice]);

  const speak = () => {
    if (!text.trim()) {
      alert('Please enter some text to convert to speech');
      return;
    }

    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    // Set voice
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      alert('Error occurred during speech synthesis');
    };

    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const recordAndDownload = async () => {
    if (!text.trim()) {
      alert('Please enter some text to convert to speech');
      return;
    }

    try {
      // Create audio context for recording
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const destination = audioContext.createMediaStreamDestination();
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(destination.stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Auto download
        const a = document.createElement('a');
        a.href = url;
        a.download = `speech_${Date.now()}.wav`;
        a.click();
      };
      
      // Start recording
      mediaRecorder.start();
      
      // Create utterance for recording
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = voices.find(v => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      
      utterance.onend = () => {
        setTimeout(() => {
          mediaRecorder.stop();
        }, 500); // Small delay to ensure all audio is captured
      };
      
      speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error('Error recording speech:', error);
      alert('Recording not supported in this browser. Use the play button to listen.');
    }
  };

  const insertSampleText = () => {
    setText("Welcome to our advanced Text to Speech tool! This professional-grade converter transforms your written content into natural-sounding speech using cutting-edge browser technology. You can customize voice, speed, pitch, and volume to create the perfect audio experience for your needs.");
  };

  return (
    <ToolShell
      title="Text to Speech Pro"
      description="Convert text to natural-sounding speech with multiple voices, languages, and professional audio controls"
      category="Audio Tools"
      features={[
        "Multiple voice options",
        "Adjustable speech rate and pitch",
        "Volume control",
        "Real-time playback",
        "Audio recording and download",
        "Support for multiple languages"
      ]}
      seoContent={{
        guides: [
          "Enter or paste your text in the text area",
          "Select your preferred voice and language",
          "Adjust speech rate, pitch, and volume settings",
          "Click 'Speak' to hear the text read aloud",
          "Use 'Record & Download' to save as audio file"
        ],
        faqs: [
          {
            question: "What voices are available?",
            answer: "Available voices depend on your operating system and browser. Most systems include male and female voices in multiple languages including English, Spanish, French, German, and more."
          },
          {
            question: "Can I download the speech as an audio file?",
            answer: "Yes! Use the 'Record & Download' feature to save the generated speech as a WAV audio file that you can use anywhere."
          },
          {
            question: "Is there a text length limit?",
            answer: "While there's no strict limit, very long texts may be split into chunks. For best results, use texts under 1000 characters per conversion."
          }
        ]
      }}
    >
      <div className="space-y-6">
        {/* Text Input */}
        <div className="glassmorphism rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-slate-100">Text Input</h3>
            <button
              onClick={insertSampleText}
              className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1 rounded-lg transition-colors"
              data-testid="button-sample-text"
            >
              Insert Sample
            </button>
          </div>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the text you want to convert to speech..."
            className="w-full h-32 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 resize-none focus:outline-none focus:border-purple-500"
            data-testid="textarea-text-input"
          />
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-slate-400">
              {text.length} characters
            </span>
            <button
              onClick={() => setText('')}
              className="text-sm text-red-400 hover:text-red-300"
              data-testid="button-clear-text"
            >
              Clear Text
            </button>
          </div>
        </div>

        {/* Voice Settings */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-xl font-semibold text-slate-100 mb-4">Voice Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Voice Selection
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                data-testid="select-voice"
              >
                {voices.map((voice, index) => (
                  <option key={index} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Speech Rate: {rate}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full"
                data-testid="slider-rate"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Slow</span>
                <span>Normal</span>
                <span>Fast</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Pitch: {pitch}
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full"
                data-testid="slider-pitch"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Low</span>
                <span>Normal</span>
                <span>High</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Volume: {Math.round(volume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full"
                data-testid="slider-volume"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Silent</span>
                <span>Medium</span>
                <span>Loud</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-xl font-semibold text-slate-100 mb-4">Playback Controls</h3>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={speak}
              disabled={!text.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white py-3 px-6 rounded-xl transition-colors flex items-center"
              data-testid="button-speak"
            >
              <i className={`fas ${isSpeaking ? 'fa-pause' : 'fa-play'} mr-2`}></i>
              {isSpeaking ? 'Pause' : 'Speak'}
            </button>
            
            <button
              onClick={stop}
              disabled={!isSpeaking}
              className="bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white py-3 px-6 rounded-xl transition-colors flex items-center"
              data-testid="button-stop"
            >
              <i className="fas fa-stop mr-2"></i>
              Stop
            </button>
            
            <button
              onClick={recordAndDownload}
              disabled={!text.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white py-3 px-6 rounded-xl transition-colors flex items-center"
              data-testid="button-record-download"
            >
              <i className="fas fa-download mr-2"></i>
              Record & Download
            </button>
          </div>
          
          {isSpeaking && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center space-x-2 text-purple-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>Speaking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Audio Preview */}
        {audioUrl && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Generated Audio</h3>
            <audio controls src={audioUrl} className="w-full" data-testid="audio-preview" />
          </div>
        )}
      </div>
    </ToolShell>
  );
};

export default TextToSpeech;