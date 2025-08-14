import React, { useState, useEffect, useRef } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const PomodoroTimer = ({ tool }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [settings, setSettings] = useState({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    pomodorosUntilLongBreak: 4
  });
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);

  const phases = {
    work: { 
      name: 'Focus Time', 
      color: 'bg-red-500', 
      duration: settings.workDuration,
      emoji: '🍅'
    },
    shortBreak: { 
      name: 'Short Break', 
      color: 'bg-green-500', 
      duration: settings.shortBreakDuration,
      emoji: '☕'
    },
    longBreak: { 
      name: 'Long Break', 
      color: 'bg-blue-500', 
      duration: settings.longBreakDuration,
      emoji: '🏖️'
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handlePhaseComplete();
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft]);

  const handlePhaseComplete = () => {
    setIsActive(false);
    playNotificationSound();
    
    if (currentPhase === 'work') {
      const newCompletedPomodoros = completedPomodoros + 1;
      setCompletedPomodoros(newCompletedPomodoros);
      
      // Determine next break type
      if (newCompletedPomodoros % settings.pomodorosUntilLongBreak === 0) {
        setCurrentPhase('longBreak');
        setTimeLeft(settings.longBreakDuration * 60);
      } else {
        setCurrentPhase('shortBreak');
        setTimeLeft(settings.shortBreakDuration * 60);
      }
      
      alert('🍅 Pomodoro completed! Time for a break.');
    } else {
      setCurrentPhase('work');
      setTimeLeft(settings.workDuration * 60);
      alert('Break time is over! Ready for another focus session?');
    }
  };

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(phases[currentPhase].duration * 60);
  };

  const resetSession = () => {
    setIsActive(false);
    setCurrentPhase('work');
    setTimeLeft(settings.workDuration * 60);
    setCompletedPomodoros(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = phases[currentPhase].duration * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const updateSettings = () => {
    // Reset current phase duration if settings changed
    if (currentPhase === 'work') {
      setTimeLeft(settings.workDuration * 60);
    } else if (currentPhase === 'shortBreak') {
      setTimeLeft(settings.shortBreakDuration * 60);
    } else if (currentPhase === 'longBreak') {
      setTimeLeft(settings.longBreakDuration * 60);
    }
    
    setShowSettings(false);
    setIsActive(false);
  };

  return (
    <ToolShell
      title="Pomodoro Timer"
      description="Focus timer using the Pomodoro Technique with work sessions and break intervals"
      category="Productivity Tools"
      features={[
        "25-minute focus sessions with breaks",
        "Automatic break scheduling",
        "Customizable session durations",
        "Progress tracking and statistics"
      ]}
      faqs={[
        {
          question: "What is the Pomodoro Technique?",
          answer: "The Pomodoro Technique is a time management method using 25-minute focused work sessions followed by short breaks, with longer breaks after every 4 pomodoros."
        },
        {
          question: "Can I customize the timer durations?",
          answer: "Yes, you can adjust work session length, short break duration, long break duration, and how many pomodoros before a long break."
        },
        {
          question: "What happens when a session ends?",
          answer: "The timer automatically stops, plays a notification sound, and shows an alert. It then sets up the next phase (work or break)."
        }
      ]}
    >
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <span className="text-4xl mr-3">{phases[currentPhase].emoji}</span>
              <h3 className="text-2xl font-semibold">{phases[currentPhase].name}</h3>
            </div>
            
            <div className={`w-64 h-64 mx-auto rounded-full ${phases[currentPhase].color} flex items-center justify-center mb-6 relative overflow-hidden`}>
              <div 
                className="absolute inset-0 bg-black bg-opacity-20"
                style={{
                  background: `conic-gradient(rgba(0,0,0,0.3) ${getProgress()}%, transparent ${getProgress()}%)`
                }}
              />
              <div className="text-white text-4xl font-mono font-bold z-10">
                {formatTime(timeLeft)}
              </div>
            </div>
            
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={toggleTimer}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition duration-200 ${
                  isActive 
                    ? 'bg-yellow-600 hover:bg-yellow-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isActive ? 'Pause' : 'Start'}
              </button>
              
              <button
                onClick={resetTimer}
                className="px-6 py-3 rounded-lg font-semibold bg-gray-600 text-white hover:bg-gray-700 transition duration-200"
              >
                Reset
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-6 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
              >
                Settings
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {completedPomodoros}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed Pomodoros</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.floor(completedPomodoros / settings.pomodorosUntilLongBreak)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed Cycles</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Math.round((completedPomodoros * settings.workDuration) / 60 * 10) / 10}h
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Focus Time Today</div>
          </div>
        </div>

        {showSettings && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-4">Timer Settings</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Work Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.workDuration}
                  onChange={(e) => setSettings(prev => ({ ...prev, workDuration: parseInt(e.target.value) || 25 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Short Break (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.shortBreakDuration}
                  onChange={(e) => setSettings(prev => ({ ...prev, shortBreakDuration: parseInt(e.target.value) || 5 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Long Break (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.longBreakDuration}
                  onChange={(e) => setSettings(prev => ({ ...prev, longBreakDuration: parseInt(e.target.value) || 15 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Pomodoros until Long Break</label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={settings.pomodorosUntilLongBreak}
                  onChange={(e) => setSettings(prev => ({ ...prev, pomodorosUntilLongBreak: parseInt(e.target.value) || 4 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={updateSettings}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-200"
              >
                Apply Settings
              </button>
              
              <button
                onClick={resetSession}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-200"
              >
                Reset Session
              </button>
              
              <button
                onClick={() => setShowSettings(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">How the Pomodoro Technique Works</h4>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p>1. Choose a task to focus on</p>
            <p>2. Work for {settings.workDuration} minutes without distractions</p>
            <p>3. Take a {settings.shortBreakDuration}-minute break</p>
            <p>4. Repeat steps 2-3 for {settings.pomodorosUntilLongBreak} cycles</p>
            <p>5. Take a longer {settings.longBreakDuration}-minute break</p>
          </div>
        </div>
      </div>
    </ToolShell>
  );
};

export default PomodoroTimer;