import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

interface VoiceNotePlayerProps {
  duration?: number;
  waveform?: number[];
  isOutgoing?: boolean;
}

export const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({
  duration = 12,
  waveform = [20, 35, 60, 80, 50, 40, 70, 90, 65, 45, 30, 55, 75, 80, 45, 35, 60, 50],
  isOutgoing = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.5;
        });
      }, 500);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, duration]);

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const progressPercent = Math.min(100, (currentTime / duration) * 100);

  const formatSecs = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex items-center gap-3 py-1 min-w-[220px] max-w-[280px]">
      <button
        onClick={togglePlay}
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
          isOutgoing
            ? 'bg-white text-emerald-700 hover:bg-emerald-50 shadow-xs'
            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
        }`}
        title={isPlaying ? 'Pause voice message' : 'Play voice message'}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </button>

      <div className="flex-1 flex flex-col gap-1">
        {/* Waveform bars */}
        <div className="flex items-center gap-[2px] h-6 cursor-pointer" onClick={togglePlay}>
          {waveform.map((val, idx) => {
            const barPercent = (idx / waveform.length) * 100;
            const isPlayed = barPercent <= progressPercent;

            return (
              <div
                key={idx}
                className="w-1 rounded-full transition-all duration-150"
                style={{
                  height: `${Math.max(15, (val / 100) * 24)}px`,
                  backgroundColor: isOutgoing
                    ? isPlayed
                      ? 'rgba(255, 255, 255, 0.95)'
                      : 'rgba(255, 255, 255, 0.4)'
                    : isPlayed
                    ? '#059669'
                    : '#cbd5e1',
                }}
              />
            );
          })}
        </div>

        {/* Duration timer */}
        <div className="flex justify-between items-center text-[10px] tabular-nums">
          <span className={isOutgoing ? 'text-emerald-100' : 'text-slate-500'}>
            {formatSecs(currentTime > 0 ? currentTime : duration)}
          </span>
          <span className={`text-[9px] ${isOutgoing ? 'text-emerald-200' : 'text-slate-400'}`}>
            Voice Note
          </span>
        </div>
      </div>
    </div>
  );
};
