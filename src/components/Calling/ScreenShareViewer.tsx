import React, { useState } from 'react';
import {
  Monitor,
  Smartphone,
  Image as ImageIcon,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  MousePointer,
  Heart,
  Sparkles,
  CheckCircle2,
  X,
} from 'lucide-react';

interface ScreenShareViewerProps {
  source: 'native' | 'tech_assist' | 'photos' | 'recipe';
  onClose: () => void;
  stream?: MediaStream | null;
}

const FAMILY_ALBUM_PHOTOS = [
  {
    title: 'Family Summer Picnic at the Park 🌿',
    url: '/src/assets/images/family_photo_park_1790394119074.jpg',
    description: 'Golden hour at the botanical gardens. Everyone was laughing so hard at Leo’s duck imitation!',
    date: 'August 14',
  },
  {
    title: 'Grandma Rose with Her Tea Roses 🌹',
    url: '/src/assets/images/avatar_grandma_1790394071440.jpg',
    description: 'First bloom of the spring yellow roses.',
    date: 'May 10',
  },
  {
    title: 'Dad Finishing the Patio Table 🛠️',
    url: '/src/assets/images/avatar_dad_1790394095799.jpg',
    description: 'Fresh oak wood varnish all done for our family dinners.',
    date: 'June 21',
  },
];

export const ScreenShareViewer: React.FC<ScreenShareViewerProps> = ({
  source,
  onClose,
}) => {
  // Slideshow state
  const [photoIndex, setPhotoIndex] = useState(0);
  const [loveFloating, setLoveFloating] = useState<number[]>([]);

  // Tech assist guide steps
  const [techStep, setTechStep] = useState(1);
  const [highlightedButton, setHighlightedButton] = useState<'photos' | 'volume' | 'wifi' | 'text'>('photos');

  // Recipe checklist
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({
    'Fresh ripe peaches (peeled & sliced)': true,
    'Grandma’s golden butter pastry crust': true,
    'Cinnamon & brown sugar mix': false,
    'Vanilla bean ice cream': true,
  });

  const triggerLove = () => {
    setLoveFloating(prev => [...prev, Date.now()]);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 flex flex-col items-center justify-center p-3 sm:p-6 text-white overflow-hidden rounded-2xl">
      {/* Top Bar Indicator */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-xs">
          <Monitor className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-emerald-300">
            {source === 'native' && 'Live Screen Share'}
            {source === 'tech_assist' && 'Family Tech Assist: Guiding Grandma Rose'}
            {source === 'photos' && 'Shared Family Photo Slideshow'}
            {source === 'recipe' && 'Family Kitchen: Sunday Peach Cobbler Recipe'}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 bg-slate-800/80 hover:bg-rose-600 rounded-full transition-colors text-slate-300 hover:text-white"
          title="Stop sharing"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Mode 1: Grandma Tech Assist Mode */}
      {source === 'tech_assist' && (
        <div className="max-w-md w-full bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center relative mt-6">
          <div className="w-12 h-1 bg-slate-700 rounded-full mb-4" />
          <h3 className="text-base font-bold text-white mb-1 font-display">
            Grandma's Tablet Screen
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Family members can point and guide Grandma in real time!
          </p>

          {/* Simulated Tablet UI */}
          <div className="w-full bg-slate-800 rounded-2xl p-4 border border-slate-700 space-y-3 relative">
            <div className="text-left text-xs font-semibold text-slate-300 pb-2 border-b border-slate-700 flex justify-between items-center">
              <span>Home Screen</span>
              <span className="text-[10px] text-emerald-400">Connected to Family Wi-Fi</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  setHighlightedButton('photos');
                  setTechStep(2);
                }}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all relative ${
                  highlightedButton === 'photos'
                    ? 'border-emerald-400 bg-emerald-950/60 ring-2 ring-emerald-500 scale-102'
                    : 'border-slate-700 bg-slate-900/60 hover:border-slate-600'
                }`}
              >
                <ImageIcon className="w-6 h-6 text-emerald-400" />
                <span className="text-xs font-medium">Family Photos</span>
                {highlightedButton === 'photos' && (
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-rose-500 text-white rounded-full text-[9px] font-bold animate-bounce">
                    Tap here!
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setHighlightedButton('text');
                  setTechStep(3);
                }}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all relative ${
                  highlightedButton === 'text'
                    ? 'border-emerald-400 bg-emerald-950/60 ring-2 ring-emerald-500 scale-102'
                    : 'border-slate-700 bg-slate-900/60 hover:border-slate-600'
                }`}
              >
                <Sparkles className="w-6 h-6 text-amber-400" />
                <span className="text-xs font-medium">Large Font Mode</span>
              </button>
            </div>

            {/* Helper guidance note */}
            <div className="mt-3 p-3 bg-emerald-900/40 border border-emerald-500/40 rounded-xl text-left text-xs">
              <p className="font-semibold text-emerald-300 flex items-center gap-1.5">
                <MousePointer className="w-3.5 h-3.5" />
                Step {techStep} of 3:
              </p>
              <p className="text-slate-300 text-[11px] mt-0.5">
                {techStep === 1 && 'Grandma, look at the green glowing box that says "Family Photos" and tap it once.'}
                {techStep === 2 && 'Great! Now tap "Open Album" to see pictures from Sunday brunch!'}
                {techStep === 3 && 'All done! Large text is active so you can read all messages easily.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Shared Family Photo Album */}
      {source === 'photos' && (
        <div className="max-w-2xl w-full flex flex-col items-center mt-6">
          <div className="relative w-full max-h-[60vh] rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-800 group">
            <img
              src={FAMILY_ALBUM_PHOTOS[photoIndex].url}
              alt={FAMILY_ALBUM_PHOTOS[photoIndex].title}
              className="w-full h-full object-contain max-h-[55vh]"
            />

            {/* Nav Arrows */}
            <button
              onClick={() =>
                setPhotoIndex(
                  prev => (prev - 1 + FAMILY_ALBUM_PHOTOS.length) % FAMILY_ALBUM_PHOTOS.length
                )
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setPhotoIndex(prev => (prev + 1) % FAMILY_ALBUM_PHOTOS.length)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Floating love hearts */}
            <div className="absolute inset-0 pointer-events-none">
              {loveFloating.map(id => (
                <span
                  key={id}
                  className="absolute bottom-10 right-10 text-3xl animate-bounce"
                >
                  ❤️
                </span>
              ))}
            </div>
          </div>

          <div className="w-full flex items-center justify-between mt-3 px-2">
            <div>
              <h4 className="text-sm font-semibold text-white">
                {FAMILY_ALBUM_PHOTOS[photoIndex].title}
              </h4>
              <p className="text-xs text-slate-400">
                {FAMILY_ALBUM_PHOTOS[photoIndex].description}
              </p>
            </div>

            <button
              onClick={triggerLove}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 rounded-full text-xs font-semibold shadow-md active:scale-95 transition-transform"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Send Love</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode 3: Sunday Recipe Checklist */}
      {source === 'recipe' && (
        <div className="max-w-lg w-full bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl mt-6">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl">
              🥧
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Grandma's Famous Peach Cobbler
              </h3>
              <p className="text-xs text-slate-400">
                Cooking together for Sunday Family Brunch!
              </p>
            </div>
          </div>

          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Ingredients Checklist:
          </p>
          <div className="space-y-2 mb-4">
            {Object.entries(checkedIngredients).map(([name, checked]) => (
              <label
                key={name}
                className="flex items-center gap-3 p-2 bg-slate-800/80 hover:bg-slate-800 rounded-xl cursor-pointer text-xs transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    setCheckedIngredients(prev => ({ ...prev, [name]: !checked }))
                  }
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-0 bg-slate-900 border-slate-600"
                />
                <span
                  className={
                    checked ? 'line-through text-slate-500 font-medium' : 'text-slate-200 font-medium'
                  }
                >
                  {name}
                </span>
              </label>
            ))}
          </div>

          <div className="bg-amber-950/40 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-200">
            <span className="font-bold">Grandma's Secret Tip:</span> Add a tiny pinch of freshly grated nutmeg into the peach butter mixture before pouring into the cast iron pan!
          </div>
        </div>
      )}

      {/* Mode 4: Native Browser Screen Share Stream */}
      {source === 'native' && (
        <div className="flex flex-col items-center justify-center text-center p-8 mt-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-900/40 border border-emerald-500 flex items-center justify-center mb-4">
            <Monitor className="w-8 h-8 text-emerald-400 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            Screen Share Active
          </h3>
          <p className="text-xs text-slate-400 max-w-md mb-4">
            You are sharing your screen with the family. They can see your documents, photos, or apps in real-time.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
          >
            Stop Sharing Screen
          </button>
        </div>
      )}
    </div>
  );
};
