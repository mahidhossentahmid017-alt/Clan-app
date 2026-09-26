import React, { useState } from 'react';
import { useClan } from '../../context/ClanContext';
import { Plus, X, Gamepad2, Sparkles } from 'lucide-react';

interface CreateGuildModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateGuildModal: React.FC<CreateGuildModalProps> = ({ isOpen, onClose }) => {
  const { createGuild } = useClan();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('⚡');
  const [gameCategory, setGameCategory] = useState('Cyber Strike: Arena');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createGuild(name.trim(), description.trim(), icon, gameCategory);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#121622] border border-[#252d42] rounded-3xl max-w-md w-full p-6 shadow-2xl text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold font-display flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>Create a Gaming Guild</span>
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              Server / Clan Name:
            </label>
            <input
              type="text"
              placeholder="e.g. Apex Predators Squad"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#181d2a] border border-[#262f44] rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              Select Emoji Icon:
            </label>
            <div className="flex gap-2">
              {['⚡', '🎮', '🎯', '🔥', '🌸', '🏆'].map(emoji => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setIcon(emoji)}
                  className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center border transition-all ${
                    icon === emoji
                      ? 'border-emerald-500 bg-emerald-950/60 ring-1 ring-emerald-500'
                      : 'border-[#262f44] bg-[#181d2a]'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              Game Focus:
            </label>
            <input
              type="text"
              placeholder="e.g. Tactical Shooter / RPG"
              value={gameCategory}
              onChange={e => setGameCategory(e.target.value)}
              className="w-full bg-[#181d2a] border border-[#262f44] rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              Description / Rules:
            </label>
            <textarea
              placeholder="Community focus, scrim schedule, welcome notes..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-[#181d2a] border border-[#262f44] rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
            >
              Create Clan Server
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
