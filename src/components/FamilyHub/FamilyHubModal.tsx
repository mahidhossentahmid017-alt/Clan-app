import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import {
  Image as ImageIcon,
  Calendar,
  Users,
  Plus,
  X,
  Clock,
  MapPin,
  Heart,
  ShieldCheck,
  CheckCircle,
  Share2,
} from 'lucide-react';
import { FamilyEvent } from '../../types';

interface FamilyHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'album' | 'events' | 'status';
}

export const FamilyHubModal: React.FC<FamilyHubModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'album',
}) => {
  const {
    familyEvents,
    addFamilyEvent,
    members,
    currentUser,
    updateMemberStatus,
    openLightbox,
    chats,
    messages,
  } = useFamily();

  const [activeTab, setActiveTab] = useState<'album' | 'events' | 'status'>(defaultTab);

  // New Event Form State
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');

  // Status message update state
  const [myStatusText, setMyStatusText] = useState(currentUser.statusMessage);
  const [statusUpdatedSuccess, setStatusUpdatedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDate.trim()) return;

    addFamilyEvent({
      title: newEventTitle.trim(),
      date: newEventDate.trim(),
      time: newEventTime.trim() || 'All Day',
      description: newEventDesc.trim(),
      organizer: currentUser.nickname,
      attendees: ['All Family Members'],
    });

    setNewEventTitle('');
    setNewEventDate('');
    setNewEventTime('');
    setNewEventDesc('');
    setShowAddEvent(false);
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    updateMemberStatus('online', myStatusText);
    setStatusUpdatedSuccess(true);
    setTimeout(() => setStatusUpdatedSuccess(false), 3000);
  };

  // Collect all photos from chats
  const sharedPhotos = [
    {
      id: 'photo-hero',
      url: '/src/assets/images/family_photo_park_1790394119074.jpg',
      name: 'Picnic in the Botanical Gardens',
      date: 'Last Weekend',
      uploadedBy: 'Grandma Rose',
      likes: 5,
    },
    {
      id: 'photo-grandma',
      url: '/src/assets/images/avatar_grandma_1790394071440.jpg',
      name: 'Grandma Rose Baking Muffins',
      date: 'Yesterday',
      uploadedBy: 'Mom',
      likes: 4,
    },
    {
      id: 'photo-dad',
      url: '/src/assets/images/avatar_dad_1790394095799.jpg',
      name: 'Dad Building Patio Table',
      date: '3 days ago',
      uploadedBy: 'Dad',
      likes: 3,
    },
    {
      id: 'photo-leo',
      url: '/src/assets/images/avatar_teen_1790394107569.jpg',
      name: 'Leo After Soccer Victory',
      date: 'Last Saturday',
      uploadedBy: 'Leo',
      likes: 6,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
              🏡
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                The Miller Family Hub
              </h2>
              <p className="text-xs text-slate-500">
                Shared family memories, calendar & real-time statuses
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="px-6 pt-3 border-b border-slate-100 flex gap-2">
          <button
            onClick={() => setActiveTab('album')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'album'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Shared Photo Album</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'events'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Family Calendar ({familyEvents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('status')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'status'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Family Status & Check-ins</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: Shared Album */}
          {activeTab === 'album' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-slate-500">
                  All photos & video clips shared across family conversations
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sharedPhotos.map(item => (
                  <div
                    key={item.id}
                    onClick={() =>
                      openLightbox({
                        id: item.id,
                        type: 'image',
                        url: item.url,
                        name: item.name,
                        caption: `${item.name} · Shared by ${item.uploadedBy}`,
                      })
                    }
                    className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-2xs hover:shadow-md transition-all"
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-slate-900">
                      <img
                        src={item.url}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-2 inset-x-3 text-white text-xs flex justify-between items-end">
                        <span className="font-semibold truncate max-w-[180px]">
                          {item.name}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] bg-black/40 px-2 py-0.5 rounded-full">
                          <Heart className="w-3 h-3 text-rose-500 fill-current" />
                          <span>{item.likes}</span>
                        </span>
                      </div>
                    </div>
                    <div className="p-3 text-[11px] text-slate-500 flex justify-between">
                      <span>By {item.uploadedBy}</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Family Calendar */}
          {activeTab === 'events' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-slate-500">
                  Birthdays, Sunday Brunches, Soccer Games & Family Reunions
                </span>

                <button
                  onClick={() => setShowAddEvent(prev => !prev)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Event</span>
                </button>
              </div>

              {/* Add Event Form Drawer */}
              {showAddEvent && (
                <form
                  onSubmit={handleCreateEvent}
                  className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3"
                >
                  <h4 className="text-xs font-bold text-slate-800">
                    Create Family Gathering or Reminder
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Event Title (e.g. Sunday Barbecue 🥩)"
                      value={newEventTitle}
                      onChange={e => setNewEventTitle(e.target.value)}
                      className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Date (e.g. This Sunday, May 12)"
                      value={newEventDate}
                      onChange={e => setNewEventDate(e.target.value)}
                      className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Time (e.g. 12:00 PM)"
                      value={newEventTime}
                      onChange={e => setNewEventTime(e.target.value)}
                      className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Notes / Who brings what?"
                      value={newEventDesc}
                      onChange={e => setNewEventDesc(e.target.value)}
                      className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddEvent(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                    >
                      Save to Calendar
                    </button>
                  </div>
                </form>
              )}

              {/* Event Cards */}
              <div className="space-y-3">
                {familyEvents.map(evt => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-400 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex flex-col items-center justify-center font-bold shrink-0">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 font-display">
                          {evt.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                          <span className="font-semibold text-emerald-700">
                            {evt.date}
                          </span>
                          <span>·</span>
                          <span>{evt.time}</span>
                          <span>·</span>
                          <span>By {evt.organizer}</span>
                        </div>
                        {evt.description && (
                          <p className="text-xs text-slate-600 mt-1">
                            {evt.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] bg-slate-100 px-3 py-1 rounded-full text-slate-700 font-medium">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>Family Gathering</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Status & Check-ins */}
          {activeTab === 'status' && (
            <div className="space-y-6">
              {/* Update My Status */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <h4 className="text-xs font-bold text-slate-800 mb-2">
                  Update What You're Doing ({currentUser.name})
                </h4>
                <form onSubmit={handleSaveStatus} className="flex gap-2">
                  <input
                    type="text"
                    value={myStatusText}
                    onChange={e => setMyStatusText(e.target.value)}
                    placeholder="e.g. Baking cookies 🍪, At the gym 🏋️, Studying 📚"
                    className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors shrink-0"
                  >
                    {statusUpdatedSuccess ? 'Updated ✓' : 'Update Status'}
                  </button>
                </form>
              </div>

              {/* Family Members Statuses Overview */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Current Family Statuses
                </h4>
                <div className="space-y-3">
                  {members.map(member => (
                    <div
                      key={member.id}
                      className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                          />
                          <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                              member.status === 'online'
                                ? 'bg-emerald-500'
                                : member.status === 'away'
                                ? 'bg-amber-400'
                                : 'bg-slate-300'
                            }`}
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {member.name} ({member.role})
                          </p>
                          <p className="text-xs text-slate-600">
                            {member.statusMessage}
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        {member.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
