'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { MessageSquare, Send, LogIn, LogOut, Clock, User, ChevronLeft, ChevronRight, Heart, Reply } from 'lucide-react';

interface GuestbookMessage {
  id: string;
  body: string;
  author_name: string;
  avatar_url: string | null;
  createdAt: string;
  likes: number;
  replies?: GuestbookMessage[];
}

const MAX_CHARS = 500;

const Guestbook = () => {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());

  const ITEMS_PER_PAGE = 3;

  // Fetch approved messages
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/guestbook');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to fetch guestbook:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Show toast notification
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Submit message
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || body.trim().length < 3) return;
    if (body.trim().length > MAX_CHARS) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: body.trim() }),
      });

      if (res.ok) {
        setBody('');
        setCurrentPage(1); // Reset to page 1 after submitting
        showToast('✅ Message sent and pending admin approval.');
      } else {
        const data = await res.json();
        showToast(`❌ ${data.error || 'Failed to send message.'}`);
      }
    } catch {
      showToast('❌ A network error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyBody.trim() || replyBody.trim().length < 3) return;
    if (replyBody.trim().length > MAX_CHARS) return;

    setIsReplying(true);
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: replyBody.trim(), parentId }),
      });

      if (res.ok) {
        setReplyBody('');
        setReplyingTo(null);
        showToast('✅ Reply sent and pending admin approval.');
      } else {
        const data = await res.json();
        showToast(`❌ ${data.error || 'Failed to send reply.'}`);
      }
    } catch {
      showToast('❌ A network error occurred.');
    } finally {
      setIsReplying(false);
    }
  };

  const updateLikesInTree = (msgs: GuestbookMessage[], targetId: string): GuestbookMessage[] => {
    return msgs.map(msg => {
      if (msg.id === targetId) return { ...msg, likes: msg.likes + 1 };
      if (msg.replies) return { ...msg, replies: updateLikesInTree(msg.replies, targetId) };
      return msg;
    });
  };

  const handleLike = async (id: string) => {
    if (likedMessages.has(id)) return;

    // Optimistic update
    setMessages(prev => updateLikesInTree(prev, id));
    setLikedMessages(prev => new Set(prev).add(id));

    try {
      await fetch('/api/guestbook/like', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Format relative time
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} mins ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} days ago`;
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const charsLeft = MAX_CHARS - body.length;

  const totalPages = Math.ceil(messages.length / ITEMS_PER_PAGE);
  const paginatedMessages = messages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section id="guestbook" className="py-20 bg-surface">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Section Title */}
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-4 font-poppins text-slate-900"
          data-aos="fade-up"
        >
          Guestbook
        </h2>
        <p
          className="text-center text-textMain/60 mb-12 text-sm md:text-base"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Leave a message, impression, or greeting — with or without logging in.
        </p>

        {/* Auth & Form Card */}
        <div
          className="bg-surface shadow-neu-out rounded-3xl p-6 md:p-8 mb-10"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {/* Auth Status */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            {status === 'authenticated' && session?.user ? (
              <div className="flex items-center gap-3">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'Avatar'}
                    width={36}
                    height={36}
                    className="rounded-full border-2 border-accent/30"
                  />
                )}
                <div>
                  <p className="text-sm font-semibold text-textMain">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-textMain/50">Signed in via GitHub</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-textMain/50">
                <User size={16} />
                <span className="text-sm">Posting as Anonymous</span>
              </div>
            )}

            <div>
              {status === 'authenticated' ? (
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-surface shadow-neu-in rounded-full text-textMain/70 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <LogOut size={13} />
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => signIn('github')}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#24292e] text-white rounded-full hover:bg-[#1b1f23] transition-colors cursor-pointer"
                >
                  <LogIn size={13} />
                  Sign in with GitHub
                </button>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <textarea
                id="guestbook-input"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message, impression, or greeting here..."
                maxLength={MAX_CHARS}
                rows={3}
                className="w-full bg-surface shadow-neu-in rounded-2xl p-4 pr-12 text-sm text-textMain placeholder:text-textMain/40 resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow"
              />
              {/* Character counter */}
              <span
                className={`absolute bottom-3 right-4 text-xs ${
                  charsLeft < 50 ? 'text-red-500' : 'text-textMain/30'
                }`}
              >
                {body.length}/{MAX_CHARS}
              </span>
            </div>

            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={isSubmitting || body.trim().length < 3}
                className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-full hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-lg shadow-accent/20"
              >
                <Send size={14} />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1e293b] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium animate-bounce-in max-w-[90vw]">
            {toast}
          </div>
        )}

        {/* Messages List */}
        <div data-aos="fade-up" data-aos-delay="300">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare size={18} className="text-accent" />
            <h3 className="text-lg font-semibold font-poppins text-textMain">
              Recent Messages
            </h3>
            <span className="ml-auto text-xs text-textMain/40">
              {messages.length} messages
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-surface shadow-neu-out rounded-2xl p-5 animate-pulse"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-surface shadow-neu-in" />
                    <div className="h-3 w-24 rounded-full bg-surface shadow-neu-in" />
                  </div>
                  <div className="h-3 w-full rounded-full bg-surface shadow-neu-in mb-2" />
                  <div className="h-3 w-2/3 rounded-full bg-surface shadow-neu-in" />
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-textMain/40">
              <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No messages yet. Be the first! 🎉</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedMessages.map((msg) => (
                <div key={msg.id} className="space-y-3">
                  <div className="bg-surface shadow-neu-out rounded-2xl p-5 hover:shadow-[10px_10px_20px_rgba(150,175,161,0.8),-10px_-10px_20px_rgba(255,255,255,1)] transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-2.5">
                      {msg.avatar_url ? (
                        <Image
                          src={msg.avatar_url}
                          alt={msg.author_name}
                          width={32}
                          height={32}
                          className="rounded-full border-2 border-accent/20"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                          <User size={14} className="text-accent" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-textMain truncate">
                          {msg.author_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-textMain/35 shrink-0">
                        <Clock size={11} />
                        <span className="text-[11px]">{timeAgo(msg.createdAt)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-textMain/80 leading-relaxed pl-11 mb-4">
                      {msg.body}
                    </p>
                    <div className="flex items-center gap-4 pl-11">
                      <button 
                        onClick={() => handleLike(msg.id)}
                        disabled={likedMessages.has(msg.id)}
                        className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${likedMessages.has(msg.id) ? 'text-red-500' : 'text-textMain/50 hover:text-red-500'}`}
                      >
                        <Heart size={14} className={likedMessages.has(msg.id) ? "fill-red-500" : ""} />
                        <span>{msg.likes > 0 ? msg.likes : 'Like'}</span>
                      </button>
                      <button 
                        onClick={() => setReplyingTo(replyingTo === msg.id ? null : msg.id)}
                        className="flex items-center gap-1.5 text-xs font-medium text-textMain/50 hover:text-accent transition-colors"
                      >
                        <Reply size={14} />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>

                  {/* Reply Form */}
                  {replyingTo === msg.id && (
                    <div className="pl-12 pr-4 py-2 animate-fade-in-up">
                      <form onSubmit={(e) => handleReplySubmit(e, msg.id)} className="flex gap-2">
                        <input
                          type="text"
                          value={replyBody}
                          onChange={(e) => setReplyBody(e.target.value)}
                          placeholder="Write a reply..."
                          maxLength={MAX_CHARS}
                          className="flex-1 bg-surface shadow-neu-in rounded-full px-4 py-2 text-xs text-textMain placeholder:text-textMain/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
                        />
                        <button
                          type="submit"
                          disabled={isReplying || replyBody.trim().length < 3}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-accent text-white shadow-neu-out hover:shadow-neu-in disabled:opacity-50 transition-all shrink-0"
                        >
                          <Send size={12} />
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Nested Replies */}
                  {msg.replies && msg.replies.length > 0 && (
                    <div className="mt-1">
                      {msg.replies.map((reply, idx) => {
                        const isLast = idx === msg.replies!.length - 1;
                        return (
                          <div key={reply.id} className="relative pl-10 md:pl-16 pt-3 pb-2">
                            {/* L-Shape Connector */}
                            <div 
                              className="absolute left-[1.5rem] md:left-[2.5rem] border-textMain/20 border-l-[3px] border-b-[3px] rounded-bl-xl z-0"
                              style={{ top: '-1.5rem', bottom: '50%', width: '1.5rem' }}
                            />
                            {/* Vertical extension for non-last items */}
                            {!isLast && (
                              <div 
                                className="absolute left-[1.5rem] md:left-[2.5rem] border-textMain/20 border-l-[3px] z-0"
                                style={{ top: '50%', bottom: '-1.5rem' }}
                              />
                            )}
                            
                            {/* Reply Card */}
                            <div className="relative bg-surface shadow-neu-out rounded-2xl p-4 z-10">
                              <div className="flex items-center gap-2 mb-2">
                                {reply.avatar_url ? (
                                  <Image
                                    src={reply.avatar_url}
                                    alt={reply.author_name}
                                    width={24}
                                    height={24}
                                    className="rounded-full border border-accent/20"
                                  />
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                                    <User size={10} className="text-accent" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-textMain truncate">
                                    {reply.author_name}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 text-textMain/35 shrink-0">
                                  <Clock size={10} />
                                  <span className="text-[10px]">{timeAgo(reply.createdAt)}</span>
                                </div>
                              </div>
                              <p className="text-xs text-textMain/80 leading-relaxed pl-8 mb-3">
                                {reply.body}
                              </p>
                              <div className="flex items-center gap-4 pl-8">
                                <button 
                                  onClick={() => handleLike(reply.id)}
                                  disabled={likedMessages.has(reply.id)}
                                  className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${likedMessages.has(reply.id) ? 'text-red-500' : 'text-textMain/50 hover:text-red-500'}`}
                                >
                                  <Heart size={12} className={likedMessages.has(reply.id) ? "fill-red-500" : ""} />
                                  <span>{reply.likes > 0 ? reply.likes : 'Like'}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-surface shadow-neu-out hover:shadow-neu-in disabled:opacity-30 disabled:shadow-neu-out disabled:cursor-not-allowed transition-all text-textMain"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-medium text-textMain/70 font-poppins">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-surface shadow-neu-out hover:shadow-neu-in disabled:opacity-30 disabled:shadow-neu-out disabled:cursor-not-allowed transition-all text-textMain"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Guestbook;
