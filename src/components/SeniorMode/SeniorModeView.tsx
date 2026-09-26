import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import {
  Phone,
  Video,
  Mic,
  ShieldCheck,
  Heart,
  Image as ImageIcon,
  CheckCircle,
  Sparkles,
  ArrowLeft,
  Volume2,
} from 'lucide-react';

interface SeniorModeViewProps {
  onBackToStandard: () => void;
}

export const SeniorModeView: React.FC<SeniorModeViewProps> = ({ onBackToStandard }) => {
  const {
    members,
    currentUser,
    startCall,
    sendMessage,
    sendQuickCheckin,
    openLightbox,
    chats,
    setActiveChatId,
  } = useFamily();

  const [checkinSuccess, setCheckinSuccess] = useState(false);
  const [voiceRecordedSuccess, setVoiceRecordedSuccess] = useState(false);

  const familyGroupChat = chats.find(c => c.isGroup) || chats[0];

  const handleQuickSafetyTap = () => {
    sendQuickCheckin('safe', 'Sent with love from Senior Easy Mode ❤️');
    setCheckinSuccess(true);
    setTimeout(() => setCheckinSuccess(false), 4000);
  };

  const handleBigVoiceNote = () => {
    sendMessage(
      'Sent a warm voice greeting to everyone!',
      undefined,
      undefined,
      true,
      10
    );
    setVoiceRecordedSuccess(true);
    setTimeout(() => setVoiceRecordedSuccess(false), 3500);
  };

  return (
    <div className="flex-1 bg-amber-50/50 p-4 sm:p-8 overflow-y-auto max-w-5xl mx-auto w-full">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-amber-200/80 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full mb-2">
            <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
            Easy & Senior Mode Active
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Hello, {currentUser.name}!
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Tap any family member below to talk or start a video call.
          </p>
        </div>

        <button
          onClick={onBackToStandard}
          className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-transform active:scale-95 shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Standard View</span>
        </button>
      </div>

      {/* Safety Check-in (Hero Single-Tap) */}
      <div className="mb-6">
        <button
          onClick={handleQuickSafetyTap}
          className={`w-full p-6 rounded-3xl border-3 flex items-center justify-between transition-all active:scale-98 shadow-sm ${
            checkinSuccess
              ? 'bg-emerald-600 border-emerald-700 text-white'
              : 'bg-white border-emerald-400 hover:border-emerald-600 text-slate-900'
          }`}
        >
          <div className="flex items-center gap-4 text-left">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl ${
                checkinSuccess ? 'bg-white text-emerald-600' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold font-display">
                {checkinSuccess ? 'Check-in Sent to Family!' : 'Tap Here: "I am Safe & Happy"'}
              </p>
              <p
                className={`text-sm ${
                  checkinSuccess ? 'text-emerald-100' : 'text-slate-600'
                }`}
              >
                Sends an instant peaceful update to all family members.
              </p>
            </div>
          </div>

          <div
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${
              checkinSuccess ? 'bg-emerald-800 text-white' : 'bg-emerald-600 text-white'
            }`}
          >
            {checkinSuccess ? 'Sent ✓' : 'One Tap'}
          </div>
        </button>
      </div>

      {/* One-Touch Family Direct Call Buttons */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span>Call Your Family</span>
          <span className="text-xs font-normal text-slate-500">(One tap to video call)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {/* Family Group Call Card */}
          <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-emerald-500 transition-all shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/src/assets/images/family_photo_park_1790394119074.jpg"
                alt="Whole Family"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500"
              />
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Call Whole Family
                </h3>
                <p className="text-xs text-slate-500">Group Video Call</p>
              </div>
            </div>

            <button
              onClick={() => startCall(familyGroupChat.id, 'video')}
              className="w-14 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
              title="Start group family video call"
            >
              <Video className="w-7 h-7" />
            </button>
          </div>

          {/* Individual Members */}
          {members
            .filter(m => m.id !== currentUser.id)
            .map(member => {
              const directChat = chats.find(
                c => !c.isGroup && c.participantIds.includes(member.id)
              );
              const chatId = directChat ? directChat.id : familyGroupChat.id;

              return (
                <div
                  key={member.id}
                  className="bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-emerald-500 transition-all shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {member.nickname}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {member.role} · {member.statusMessage}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Voice Call */}
                    <button
                      onClick={() => startCall(chatId, 'voice')}
                      className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors"
                      title={`Call ${member.nickname}`}
                    >
                      <Phone className="w-5 h-5" />
                    </button>

                    {/* Video Call (Hero) */}
                    <button
                      onClick={() => startCall(chatId, 'video')}
                      className="w-14 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
                      title={`Video call ${member.nickname}`}
                    >
                      <Video className="w-7 h-7" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Voice Message Big Button */}
      <div className="mb-8">
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Mic className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Send Voice Message to Family
              </h3>
              <p className="text-xs text-slate-500">
                {voiceRecordedSuccess
                  ? 'Voice note sent to family group! ❤️'
                  : 'Tap below to speak directly without typing'}
              </p>
            </div>
          </div>

          <button
            onClick={handleBigVoiceNote}
            className={`px-6 py-4 rounded-2xl font-bold text-base flex items-center gap-2 transition-all shadow-md active:scale-95 ${
              voiceRecordedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            <Mic className="w-5 h-5" />
            <span>{voiceRecordedSuccess ? 'Voice Note Sent!' : 'Press to Send Voice Note'}</span>
          </button>
        </div>
      </div>

      {/* Big Family Photo Showcase */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-emerald-600" />
          <span>Recent Family Memories</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() =>
              openLightbox({
                id: 'sr-photo-1',
                type: 'image',
                url: '/src/assets/images/family_photo_park_1790394119074.jpg',
                name: 'Family Picnic in the Park',
                caption: 'Sunny picnic afternoon at the botanical garden park 🌿',
              })
            }
            className="cursor-pointer group bg-white rounded-3xl overflow-hidden border-2 border-slate-200 hover:border-emerald-500 transition-all shadow-sm"
          >
            <img
              src="/src/assets/images/family_photo_park_1790394119074.jpg"
              alt="Family Picnic"
              className="w-full h-56 object-cover group-hover:scale-102 transition-transform duration-200"
            />
            <div className="p-4">
              <h4 className="font-bold text-slate-900 text-base">
                Family Picnic at Botanical Park
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Tap to view in big fullscreen
              </p>
            </div>
          </div>

          <div
            onClick={() => {
              setActiveChatId(familyGroupChat.id);
              onBackToStandard();
            }}
            className="cursor-pointer bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 text-white flex flex-col justify-between shadow-md"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
                Messages
              </span>
              <h4 className="text-2xl font-bold font-display mt-1">
                Open Family Chat Room
              </h4>
              <p className="text-sm text-emerald-100 mt-2">
                See all greetings, jokes, recipes, and pictures sent today.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <span className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold">
                Go to Messages →
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
