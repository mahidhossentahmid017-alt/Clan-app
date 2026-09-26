import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { Users, User, X, Check, Plus } from 'lucide-react';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onClose }) => {
  const { members, currentUser, createNewChat } = useFamily();
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [groupTitle, setGroupTitle] = useState('');

  if (!isOpen) return null;

  const otherMembers = members.filter(m => m.id !== currentUser.id);
  const isGroup = selectedMemberIds.length > 1;

  const toggleSelect = (id: string) => {
    setSelectedMemberIds(prev =>
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMemberIds.length === 0) return;

    createNewChat(selectedMemberIds, groupTitle.trim(), isGroup);
    setSelectedMemberIds([]);
    setGroupTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 font-display">
            Start Family Conversation
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleStart} className="p-6">
          {/* If multiple selected, ask for group name */}
          {isGroup && (
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Group Name:
              </label>
              <input
                type="text"
                placeholder="e.g. Sunday Cooking Team 🍳"
                value={groupTitle}
                onChange={e => setGroupTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
                required
              />
            </div>
          )}

          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            Select Family Members:
          </p>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {otherMembers.map(member => {
              const isSelected = selectedMemberIds.includes(member.id);
              return (
                <div
                  key={member.id}
                  onClick={() => toggleSelect(member.id)}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/70'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {member.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {member.role} · {member.statusMessage}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedMemberIds.length === 0}
              className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors"
            >
              {isGroup ? 'Create Family Group' : 'Start Chat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
