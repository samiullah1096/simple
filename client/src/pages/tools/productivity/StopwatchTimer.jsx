import React, { useState, useEffect, useRef } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const StopwatchTimer = () => {
  const [mode, setMode] = useState('stopwatch'); // 'stopwatch' or 'timer'
  const [time, setTime] = useState(0); // in milliseconds
  const [timerDuration, setTimerDuration] = useState(300000); // 5 minutes default
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);

  // Timer input states
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (mode === 'stopwatch') {
            return prevTime + 10;
          } else {
            // Timer mode - count down
            const newTime = prevTime - 10;
            if (newTime <= 0) {
              setIsRunning(false);
              playAlert();
              return 0;
            }
            return newTime;
          }
        });
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode]);

  const playAlert = () => {
    // Simple alert sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);

    alert('Timer finished!');
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const start = () => {
    if (mode === 'timer' && time === 0) {
      const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
      if (totalMs === 0) {
        alert('Please set a timer duration');
        return;
      }
      setTime(totalMs);
      setTimerDuration(totalMs);
    }
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setTime(mode === 'timer' ? timerDuration : 0);
    setLaps([]);
  };

  const addLap = () => {
    if (mode === 'stopwatch' && time > 0) {
      const lapTime = time;
      const lapNumber = laps.length + 1;
      const previousLap = laps.length > 0 ? laps[laps.length - 1].time : 0;
      const splitTime = lapTime - previousLap;
      
      setLaps(prev => [...prev, {
        lap: lapNumber,
        time: lapTime,
        split: splitTime,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTime(newMode === 'timer' ? (hours * 3600 + minutes * 60 + seconds) * 1000 : 0);
    setLaps([]);
  };

  const getProgress = () => {
    if (mode === 'timer' && timerDuration > 0) {
      return ((timerDuration - time) / timerDuration) * 100;
    }
    return 0;
  };

  return (
    <ToolShell
      title="Stopwatch & Timer"
      description="Precision stopwatch and countdown timer with lap tracking and audio alerts"
      category="Productivity Tools"
      features={[
        "High-precision timing (centiseconds)",
        "Lap time tracking for stopwatch",
        "Customizable countdown timer",
        "Audio alerts when timer finishes"
      ]}
      faqs={[
        {
          question: "How accurate is the timing?",
          answer: "The timer is accurate to centiseconds (1/100th of a second) and updates every 10 milliseconds for smooth operation."
        },
        {
          question: "What happens when the countdown timer reaches zero?",
          answer: "The timer will stop automatically, play an alert sound, and show a notification that the time is up."
        },
        {
          question: "Can I track multiple lap times?",
          answer: "Yes, in stopwatch mode you can record unlimited lap times, with both total time and split time for each lap."
        }
      ]}
    >
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <div className="flex justify-center mb-6">
            <div className="bg-white dark:bg-gray-700 rounded-lg p-1 flex">
              <button
                onClick={() => switchMode('stopwatch')}
                className={`px-6 py-2 rounded-md transition duration-200 ${
                  mode === 'stopwatch'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                Stopwatch
              </button>
              <button
                onClick={() => switchMode('timer')}
                className={`px-6 py-2 rounded-md transition duration-200 ${
                  mode === 'timer'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                Timer
              </button>
            </div>
          </div>

          {mode === 'timer' && (
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Set Timer Duration</h4>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div>
                  <label className="block text-sm font-medium mb-1">Hours</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={hours}
                    onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                    disabled={isRunning}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 text-center"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Minutes</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                    disabled={isRunning}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 text-center"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Seconds</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                    disabled={isRunning}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 text-center"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <div className="text-6xl font-mono font-bold mb-4 text-gray-800 dark:text-gray-200">
              {formatTime(time)}
            </div>
            
            {mode === 'timer' && timerDuration > 0 && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            {!isRunning ? (
              <button
                onClick={start}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
              >
                Start
              </button>
            ) : (
              <button
                onClick={pause}
                className="bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition duration-200"
              >
                Pause
              </button>
            )}
            
            <button
              onClick={reset}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-200"
            >
              Reset
            </button>
            
            {mode === 'stopwatch' && (
              <button
                onClick={addLap}
                disabled={time === 0}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Lap
              </button>
            )}
          </div>
        </div>

        {mode === 'stopwatch' && laps.length > 0 && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Lap Times</h4>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {laps.reverse().map((lap, index) => (
                <div key={lap.lap} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="font-semibold">Lap {lap.lap}</div>
                  <div className="flex space-x-4 font-mono text-sm">
                    <div>
                      <span className="text-gray-500">Split: </span>
                      <span className="font-semibold">{formatTime(lap.split)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total: </span>
                      <span className="font-semibold">{formatTime(lap.time)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Quick Timer Presets</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: '1 min', time: [0, 1, 0] },
              { label: '5 min', time: [0, 5, 0] },
              { label: '10 min', time: [0, 10, 0] },
              { label: '25 min', time: [0, 25, 0] }
            ].map((preset, index) => (
              <button
                key={index}
                onClick={() => {
                  setHours(preset.time[0]);
                  setMinutes(preset.time[1]);
                  setSeconds(preset.time[2]);
                  switchMode('timer');
                }}
                className="text-sm bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition duration-200"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolShell>
  );
};

export default StopwatchTimer;