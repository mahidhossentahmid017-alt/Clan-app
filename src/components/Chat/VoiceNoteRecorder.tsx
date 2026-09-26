import React, { useState, useEffect, useRef } from 'react';
import { Mic, Trash2, Send, StopCircle } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface VoiceNoteRecorderProps {
  onSend: (duration: number) => void;
  onCancel: () => void;
}

export const VoiceNoteRecorder: React.FC<VoiceNoteRecorderProps> = ({ onSend, onCancel }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    soundService.playRecordBeep(true);

    // Try starting real media recorder
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(stream => {
          streamRef.current = stream;
          try {
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;
            recorder.start();
          } catch {
            // fallback
          }
        })
        .catch(() => {
          // No mic permissions - simulated recording mode continues seamlessly
        });
    }

    timerRef.current = window.setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const handleStopAndSend = () => {
    soundService.playRecordBeep(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    const finalSecs = Math.max(2, seconds);
    onSend(finalSecs);
  };

  const handleCancel = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    onCancel();
  };

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex items-center justify-between w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-xl animate-in fade-in duration-200">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
          <span className="text-xs font-bold text-rose-700 tabular-nums">
            {formatTimer(seconds)}
          </span>
        </div>

        {/* Animated sound bars */}
        <div className="flex items-center gap-1 h-5">
          {[40, 75, 100, 60, 85, 30, 95, 70, 45, 80, 55, 90].map((h, i) => (
            <div
              key={i}
              className="w-0.5 bg-rose-500 rounded-full animate-pulse"
              style={{
                height: `${(h / 100) * 18}px`,
                animationDelay: `${i * 80}ms`,
              }}
            />
          ))}
        </div>
        <span className="text-xs text-rose-600 hidden sm:inline font-medium">
          Recording family voice message...
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleCancel}
          className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
          title="Discard recording"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          onClick={handleStopAndSend}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all active:scale-95"
          title="Send voice note"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};
