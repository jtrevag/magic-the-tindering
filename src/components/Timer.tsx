import React from 'react';
import './Timer.css';

interface TimerProps {
  seconds: number;
}

const Timer: React.FC<TimerProps> = ({ seconds }) => {
  const formatTime = (time: number): string => {
    return time.toString().padStart(2, '0');
  };

  const getTimerClass = (time: number): string => {
    if (time <= 3) return 'timer-critical';
    if (time <= 7) return 'timer-warning';
    return 'timer-normal';
  };

  return (
    <div className={`timer ${getTimerClass(seconds)}`} data-testid="timer">
      <div className="timer-display">
        {formatTime(seconds)}
      </div>
      <div className="timer-label">
        seconds
      </div>
    </div>
  );
};

export default Timer;