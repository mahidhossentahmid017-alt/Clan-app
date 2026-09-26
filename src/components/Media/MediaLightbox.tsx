import React, { useEffect } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { X, Download, ZoomIn, ZoomOut, Share2, Heart } from 'lucide-react';

export const MediaLightbox: React.FC = () => {
  const { lightboxMedia, closeLightbox } = useFamily();
  const [zoom, setZoom] = React.useState(1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeLightbox]);

  if (!lightboxMedia) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = lightboxMedia.url;
    a.download = lightboxMedia.name || 'family_photo.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Top action bar */}
      <div className="flex items-center justify-between text-white z-10">
        <div className="truncate max-w-sm">
          <p className="text-sm font-bold truncate">{lightboxMedia.name}</p>
          {lightboxMedia.size && (
            <p className="text-xs text-slate-400">{lightboxMedia.size}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(prev => Math.min(2.5, prev + 0.25))}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(1, prev - 0.25))}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            title="Download original photo"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={closeLightbox}
            className="p-2 rounded-xl bg-white/20 hover:bg-rose-600 text-white transition-colors"
            title="Close viewer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        {lightboxMedia.type === 'video' ? (
          <video
            src={lightboxMedia.url}
            controls
            autoPlay
            className="max-h-[80vh] max-w-full rounded-2xl shadow-2xl"
          />
        ) : (
          <img
            src={lightboxMedia.url}
            alt={lightboxMedia.name}
            referrerPolicy="no-referrer"
            style={{ transform: `scale(${zoom})`, transition: 'transform 0.15s ease-out' }}
            className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl"
          />
        )}
      </div>

      {/* Bottom Caption */}
      {lightboxMedia.caption && (
        <div className="text-center text-xs text-slate-300 bg-black/60 backdrop-blur-sm p-3 rounded-2xl max-w-md mx-auto">
          {lightboxMedia.caption}
        </div>
      )}
    </div>
  );
};
