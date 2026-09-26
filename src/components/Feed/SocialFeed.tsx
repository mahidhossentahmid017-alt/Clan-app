import React, { useState } from 'react';
import { useClan } from '../../context/ClanContext';
import {
  Heart,
  MessageCircle,
  Share2,
  Gamepad2,
  Image as ImageIcon,
  Sparkles,
  Send,
  Flame,
  Radio,
  Trophy,
  Play,
  UserPlus,
  Users,
} from 'lucide-react';
import { SocialFeedPost } from '../../types/clan';

export const SocialFeed: React.FC = () => {
  const {
    socialPosts,
    createSocialPost,
    togglePostLike,
    addPostComment,
    currentUser,
    inspectProfile,
    profiles,
    isLowResourceMode,
  } = useClan();

  const [postText, setPostText] = useState('');
  const [selectedGameTag, setSelectedGameTag] = useState('Cyber Strike: Arena');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [openCommentsForPost, setOpenCommentsForPost] = useState<Record<string, boolean>>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) return;
    createSocialPost(postText, undefined, selectedGameTag);
    setPostText('');
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    addPostComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#0d1017] p-3 sm:p-6 no-scrollbar select-text">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Create Post Card (Facebook / Twitter Feed Style) */}
        <div className="bg-[#141824] border border-[#202638] rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-500/50"
            />
            <div className="flex-1">
              <p className="text-xs font-bold text-white font-display">
                {currentUser.displayName}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-cyan-400">
                <Gamepad2 className="w-3.5 h-3.5" />
                <select
                  value={selectedGameTag}
                  onChange={e => setSelectedGameTag(e.target.value)}
                  className="bg-transparent text-cyan-300 font-semibold outline-none cursor-pointer"
                >
                  <option value="Cyber Strike: Arena" className="bg-[#141824] text-white">Cyber Strike: Arena</option>
                  <option value="Apex Velocity" className="bg-[#141824] text-white">Apex Velocity</option>
                  <option value="Cozy Haven" className="bg-[#141824] text-white">Cozy Haven</option>
                  <option value="Clan Esports Hub" className="bg-[#141824] text-white">Clan Esports Hub</option>
                </select>
              </div>
            </div>
          </div>

          <form onSubmit={handleCreatePost}>
            <textarea
              value={postText}
              onChange={e => setPostText(e.target.value)}
              placeholder="Share a game highlight, tournament announcement, clip, or discussion..."
              rows={3}
              className="w-full bg-[#1b2030] text-sm text-white placeholder:text-slate-500 rounded-xl p-3 outline-none resize-none border border-transparent focus:border-cyan-500/60 transition-all font-sans"
            />

            <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#1f2537]">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <button
                  type="button"
                  onClick={() =>
                    createSocialPost(
                      'Just hit an incredible 1v3 railgun clutch defense in overtime! Check this highlight out! 🔥🎮',
                      {
                        type: 'clip',
                        url: '/src/assets/images/gameplay_screenshot_clip_1790394824146.jpg',
                        caption: 'Ranked Diamond Match Point Clip',
                        likesCount: 14,
                      },
                      'Cyber Strike: Arena'
                    )
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-[#1f2639] hover:bg-[#28324a] text-cyan-300 flex items-center gap-1.5 transition-colors font-medium text-[11px]"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Attach Gameplay Clip</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={!postText.trim()}
                className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                Post to Feed
              </button>
            </div>
          </form>
        </div>

        {/* Live Gamer Broadcast Banner */}
        <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/src/assets/images/avatar_valkyrie_streamer_1790394800069.jpg"
                alt="Streamer"
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-rose-500"
              />
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-rose-600 text-white font-extrabold text-[9px] rounded uppercase tracking-wider animate-pulse">
                LIVE
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5 font-display">
                <span>Valkyrie • Live is Broadcasting</span>
                <span className="text-[10px] text-cyan-300 font-normal">Apex Velocity</span>
              </p>
              <p className="text-[11px] text-slate-300">
                Championship Finals · 4.2k Viewers in Clan Lounge
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const prof = profiles.find(p => p.id === 'user-valkyrie');
              if (prof) inspectProfile(prof);
            }}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md transition-transform active:scale-95"
          >
            Watch Stream
          </button>
        </div>

        {/* Social Feed Posts Stream */}
        {socialPosts.map(post => {
          const authorProfile = profiles.find(p => p.id === post.authorId);
          const showComments = openCommentsForPost[post.id];

          return (
            <article
              key={post.id}
              className="bg-[#141824] border border-[#202638] rounded-2xl overflow-hidden shadow-sm hover:border-[#28324a] transition-colors"
            >
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div
                  onClick={() => authorProfile && inspectProfile(authorProfile)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700 group-hover:ring-cyan-400 transition-all"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white group-hover:underline font-display">
                        {post.authorName}
                      </span>
                      {post.badge && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                          {post.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>{post.authorTag}</span>
                      <span>·</span>
                      <span className="text-cyan-400 font-semibold">{post.gameTag}</span>
                      <span>·</span>
                      <span>{post.createdAt}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => authorProfile && inspectProfile(authorProfile)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1f2537]"
                  title="View gamer profile"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              </div>

              {/* Post Content Text */}
              <div className="px-4 pb-3 text-xs sm:text-sm text-slate-200 leading-relaxed break-words whitespace-pre-wrap">
                {post.content}
              </div>

              {/* Media Card (Gaming Clip / Tournament Photo) */}
              {post.media && (
                <div className="relative group bg-black/60 border-y border-[#202638]">
                  <img
                    src={post.media.url}
                    alt="Post media"
                    className="w-full max-h-96 object-cover"
                  />
                  {post.media.type === 'clip' && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 fill-current ml-1" />
                      </div>
                    </div>
                  )}
                  {post.media.caption && (
                    <div className="p-2.5 bg-[#0f121b] text-xs text-slate-300 flex justify-between items-center">
                      <span>{post.media.caption}</span>
                      <span className="text-[10px] text-cyan-400 uppercase font-bold">1080p 60fps</span>
                    </div>
                  )}
                </div>
              )}

              {/* Stats Bar */}
              <div className="px-4 py-2 border-b border-[#1c2233] flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-rose-400">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>{post.likes}</span>
                </span>

                <div className="flex items-center gap-3">
                  <span>{post.commentsCount} comments</span>
                  <span>{post.sharesCount} shares</span>
                </div>
              </div>

              {/* Interactive Engagement Buttons */}
              <div className="px-2 py-1.5 flex items-center justify-around text-xs font-semibold text-slate-300">
                <button
                  onClick={() => togglePostLike(post.id)}
                  className={`flex-1 py-1.5 flex items-center justify-center gap-1.5 rounded-lg transition-colors hover:bg-[#1c2233] ${
                    post.hasLiked ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-current' : ''}`} />
                  <span>Like</span>
                </button>

                <button
                  onClick={() =>
                    setOpenCommentsForPost(prev => ({ ...prev, [post.id]: !prev[post.id] }))
                  }
                  className="flex-1 py-1.5 flex items-center justify-center gap-1.5 rounded-lg transition-colors hover:bg-[#1c2233] text-slate-400 hover:text-white"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Comment</span>
                </button>

                <button
                  onClick={() => alert('Clip link copied to clipboard!')}
                  className="flex-1 py-1.5 flex items-center justify-center gap-1.5 rounded-lg transition-colors hover:bg-[#1c2233] text-slate-400 hover:text-white"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>

              {/* Comments Section Drawer */}
              {showComments && (
                <div className="p-4 bg-[#11141e] border-t border-[#1c2233] space-y-3">
                  {/* Comments list */}
                  {post.comments.map(c => (
                    <div key={c.id} className="flex items-start gap-2.5">
                      <img
                        src={c.authorAvatar}
                        alt={c.authorName}
                        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                      />
                      <div className="flex-1 bg-[#181d2a] rounded-xl p-2.5 text-xs">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-white">{c.authorName}</span>
                          <span className="text-[10px] text-slate-500">{c.time}</span>
                        </div>
                        <p className="text-slate-200">{c.text}</p>
                      </div>
                    </div>
                  ))}

                  {/* Add comment input */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={e =>
                        setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))
                      }
                      onKeyDown={e => e.key === 'Enter' && handleAddComment(post.id)}
                      placeholder="Write a comment or GG..."
                      className="flex-1 px-3 py-2 bg-[#1b2030] text-xs text-white placeholder:text-slate-500 rounded-xl outline-none border border-transparent focus:border-cyan-500"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="p-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
