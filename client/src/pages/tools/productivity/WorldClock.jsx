import React, { useState, useEffect } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const WorldClock = ({ tool }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimezones, setSelectedTimezones] = useState([
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
    'Australia/Sydney'
  ]);

  const timezones = [
    { name: 'New York', zone: 'America/New_York', country: 'USA' },
    { name: 'Los Angeles', zone: 'America/Los_Angeles', country: 'USA' },
    { name: 'Chicago', zone: 'America/Chicago', country: 'USA' },
    { name: 'Denver', zone: 'America/Denver', country: 'USA' },
    { name: 'London', zone: 'Europe/London', country: 'UK' },
    { name: 'Paris', zone: 'Europe/Paris', country: 'France' },
    { name: 'Berlin', zone: 'Europe/Berlin', country: 'Germany' },
    { name: 'Rome', zone: 'Europe/Rome', country: 'Italy' },
    { name: 'Moscow', zone: 'Europe/Moscow', country: 'Russia' },
    { name: 'Tokyo', zone: 'Asia/Tokyo', country: 'Japan' },
    { name: 'Shanghai', zone: 'Asia/Shanghai', country: 'China' },
    { name: 'Mumbai', zone: 'Asia/Kolkata', country: 'India' },
    { name: 'Dubai', zone: 'Asia/Dubai', country: 'UAE' },
    { name: 'Singapore', zone: 'Asia/Singapore', country: 'Singapore' },
    { name: 'Seoul', zone: 'Asia/Seoul', country: 'South Korea' },
    { name: 'Sydney', zone: 'Australia/Sydney', country: 'Australia' },
    { name: 'Melbourne', zone: 'Australia/Melbourne', country: 'Australia' },
    { name: 'Auckland', zone: 'Pacific/Auckland', country: 'New Zealand' },
    { name: 'São Paulo', zone: 'America/Sao_Paulo', country: 'Brazil' },
    { name: 'Buenos Aires', zone: 'America/Argentina/Buenos_Aires', country: 'Argentina' },
    { name: 'Mexico City', zone: 'America/Mexico_City', country: 'Mexico' },
    { name: 'Toronto', zone: 'America/Toronto', country: 'Canada' },
    { name: 'Vancouver', zone: 'America/Vancouver', country: 'Canada' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date, timezone) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(date);
    } catch (error) {
      return 'Invalid timezone';
    }
  };

  const formatDate = (date, timezone) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      return 'Invalid timezone';
    }
  };

  const getTimezoneOffset = (timezone) => {
    try {
      const date = new Date();
      const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
      const targetTime = new Date(utc + (getTimezoneOffsetHours(timezone) * 3600000));
      const offset = getTimezoneOffsetHours(timezone);
      const hours = Math.floor(Math.abs(offset));
      const minutes = Math.abs(offset % 1) * 60;
      const sign = offset >= 0 ? '+' : '-';
      return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } catch (error) {
      return 'UTC+00:00';
    }
  };

  const getTimezoneOffsetHours = (timezone) => {
    try {
      const date = new Date();
      const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
      const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
      return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
    } catch (error) {
      return 0;
    }
  };

  const addTimezone = (timezone) => {
    if (!selectedTimezones.includes(timezone)) {
      setSelectedTimezones([...selectedTimezones, timezone]);
    }
  };

  const removeTimezone = (timezone) => {
    setSelectedTimezones(selectedTimezones.filter(tz => tz !== timezone));
  };

  const getTimezoneInfo = (zone) => {
    return timezones.find(tz => tz.zone === zone) || { name: zone, zone, country: 'Unknown' };
  };

  const isDaytime = (timezone) => {
    try {
      const hour = parseInt(formatTime(currentTime, timezone).split(':')[0]);
      const period = formatTime(currentTime, timezone).split(' ')[1];
      const hour24 = period === 'PM' && hour !== 12 ? hour + 12 : (period === 'AM' && hour === 12 ? 0 : hour);
      return hour24 >= 6 && hour24 < 18;
    } catch (error) {
      return true;
    }
  };

  return (
    <ToolShell
      title="World Clock"
      description="View current time in different time zones around the world with customizable city selection"
      category="Productivity Tools"
      features={[
        "Real-time updates every second",
        "Major cities and time zones worldwide",
        "UTC offset display",
        "Day/night indicators"
      ]}
      faqs={[
        {
          question: "How accurate is the world clock?",
          answer: "The clock uses your device's system time and JavaScript's Intl.DateTimeFormat API for accurate timezone conversions."
        },
        {
          question: "Can I add custom time zones?",
          answer: "Yes, you can select from a comprehensive list of major cities and time zones around the world."
        },
        {
          question: "Does the clock adjust for daylight saving time?",
          answer: "Yes, the clock automatically adjusts for daylight saving time changes based on each timezone's current rules."
        }
      ]}
    >
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Add Time Zone</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
            {timezones.map((tz) => (
              <button
                key={tz.zone}
                onClick={() => addTimezone(tz.zone)}
                disabled={selectedTimezones.includes(tz.zone)}
                className={`text-left p-2 rounded-md text-sm transition duration-200 ${
                  selectedTimezones.includes(tz.zone)
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                }`}
              >
                <div className="font-medium">{tz.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{tz.country}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedTimezones.map((timezone) => {
            const tzInfo = getTimezoneInfo(timezone);
            const isDay = isDaytime(timezone);
            
            return (
              <div
                key={timezone}
                className={`relative overflow-hidden rounded-lg border-2 transition duration-300 ${
                  isDay
                    ? 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 border-blue-300 dark:border-blue-700'
                    : 'bg-gradient-to-br from-indigo-900 to-purple-900 border-indigo-700 text-white'
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className={`text-xl font-bold ${isDay ? 'text-gray-800 dark:text-gray-200' : 'text-white'}`}>
                        {tzInfo.name}
                      </h4>
                      <p className={`text-sm ${isDay ? 'text-gray-600 dark:text-gray-400' : 'text-gray-300'}`}>
                        {tzInfo.country}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className={`text-2xl ${isDay ? '☀️' : '🌙'}`} title={isDay ? 'Daytime' : 'Nighttime'} />
                      <button
                        onClick={() => removeTimezone(timezone)}
                        className={`text-sm px-2 py-1 rounded ${
                          isDay
                            ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800'
                            : 'bg-red-900 text-red-200 hover:bg-red-800'
                        } transition duration-200`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`text-3xl font-mono font-bold mb-2 ${isDay ? 'text-gray-800 dark:text-gray-200' : 'text-white'}`}>
                      {formatTime(currentTime, timezone)}
                    </div>
                    
                    <div className={`text-sm mb-2 ${isDay ? 'text-gray-600 dark:text-gray-400' : 'text-gray-300'}`}>
                      {formatDate(currentTime, timezone)}
                    </div>
                    
                    <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                      isDay
                        ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                        : 'bg-purple-800 text-purple-200'
                    }`}>
                      {getTimezoneOffset(timezone)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedTimezones.length === 0 && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-4xl mb-4">🌍</div>
            <h4 className="text-lg font-semibold mb-2">No Time Zones Selected</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Choose cities from the list above to see their current time
            </p>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Your Local Time</h4>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-blue-800 dark:text-blue-200">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-300">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
};

export default WorldClock;