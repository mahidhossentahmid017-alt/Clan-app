import React from 'react';
import { useFamily } from '../../context/FamilyContext';
import { Phone, Video, PhoneOff, BellRing } from 'lucide-react';

export const IncomingCallBanner: React.FC = () => {
  const { incomingCall, acceptIncomingCall, declineIncomingCall } = useFamily();

  if (!incomingCall) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-3xl p-5 shadow-2xl text-white animate-in slide-in-from-top duration-300 ring-4 ring-emerald-500/30">
      <div className="flex items-center gap-4">
        {/* Animated Caller Avatar */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-emerald-500 shadow-md">
            <img
              src={incomingCall.caller.avatar}
              alt={incomingCall.caller.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs ring-2 ring-slate-900 animate-bounce">
            <BellRing className="w-3.5 h-3.5 animate-pulse" />
          </span>
        </div>

        {/* Caller Info */}
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
            Incoming Family Video Call
          </span>
          <h3 className="text-base font-bold text-white truncate font-display">
            {incomingCall.caller.name}
          </h3>
          <p className="text-xs text-slate-400 truncate">
            {incomingCall.caller.role} · {incomingCall.caller.statusMessage}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800">
        {/* Decline */}
        <button
          onClick={declineIncomingCall}
          className="flex-1 py-2.5 px-3 rounded-2xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-rose-500/30"
        >
          <PhoneOff className="w-4 h-4" />
          <span>Decline</span>
        </button>

        {/* Accept Voice Only */}
        <button
          onClick={acceptIncomingCall}
          className="flex-1 py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
        >
          <Phone className="w-4 h-4 text-emerald-400" />
          <span>Voice</span>
        </button>

        {/* Accept with Video */}
        <button
          onClick={acceptIncomingCall}
          className="flex-1 py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-600/40 active:scale-95"
        >
          <Video className="w-4 h-4" />
          <span>Answer</span>
        </button>
      </div>
    </div>
  );
};
