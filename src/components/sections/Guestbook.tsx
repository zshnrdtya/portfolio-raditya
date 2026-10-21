'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { MessageSquare, Send, LogIn, LogOut, User } from 'lucide-react';
import { GuestbookMessageList } from './GuestbookMessageList';

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
  const [now] = useState<number>(() => Date.now());

  useEffect(() => {
    let ignore = false;
    async function loadMessages() {
      try {
        const res = await fetch('/api/guestbook');
        if (res.ok) {
          const data = await res.json();
          if (!ignore) setMessages(data);
        }
      } catch (err) {
        console.error('Failed to fetch guestbook:', err);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }
    loadMessages();
    return () => { ignore = true; };
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || body.trim().length < 3 || body.trim().length > MAX_CHARS) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: body.trim() }),
      });

      if (res.ok) {
        setBody('');
        setCurrentPage(1);
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
    if (!replyBody.trim() || replyBody.trim().length < 3 || replyBody.trim().length > MAX_CHARS) return;

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

  const updateLikesInTree = (msgs: GuestbookMessage[], targetId: string): GuestbookMessage[] =>
    msgs.map(msg => {
      if (msg.id === targetId) return { ...msg, likes: msg.likes + 1 };
      if (msg.replies) return { ...msg, replies: updateLikesInTree(msg.replies, targetId) };
      return msg;
    });

  const handleLike = async (id: string) => {
    if (likedMessages.has(id)) return;
    setMessages(prev => updateLikesInTree(prev, id));
    setLikedMessages(prev => new Set(prev).add(id));
    try {
      await fetch('/api/guestbook/like', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const timeAgo = (dateStr: string) => {
    if (!now) {
      return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    const diff = now - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} mins ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} days ago`;
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const totalPages = Math.ceil(messages.length / 3);
  const charsLeft = MAX_CHARS - body.length;

  return (
    <section id="guestbook" className="py-20 bg-surface">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-poppins text-slate-900" data-aos="fade-up">
          Guestbook
        </h2>
        <p className="text-center text-textMain/60 mb-12 text-sm md:text-base" data-aos="fade-up" data-aos-delay="100">
          Leave a message, impression, or greeting, with or without logging in.
        </p>

        {/* Auth & Form Card */}
        <div className="bg-surface shadow-neu-out rounded-3xl p-6 md:p-8 mb-10" data-aos="fade-up" data-aos-delay="200">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            {status === 'authenticated' && session?.user ? (
              <div className="flex items-center gap-3">
                {session.user.image && (
                  <Image src={session.user.image} alt={session.user.name || 'Avatar'} width={36} height={36} className="rounded-full border-2 border-accent/30" />
                )}
                <div>
                  <p className="text-sm font-semibold text-textMain">{session.user.name}</p>
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
                <button onClick={() => signOut()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-surface shadow-neu-in rounded-full text-textMain/70 hover:text-red-600 transition-colors cursor-pointer">
                  <LogOut size={13} />
                  Sign Out
                </button>
              ) : (
                <button onClick={() => signIn('github')} className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#24292e] text-white rounded-full hover:bg-[#1b1f23] transition-colors cursor-pointer">
                  <LogIn size={13} />
                  Sign in with GitHub
                </button>
              )}
            </div>
          </div>

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
              <span className={`absolute bottom-3 right-4 text-xs ${charsLeft < 50 ? 'text-red-500' : 'text-textMain/30'}`}>
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

        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1e293b] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium animate-bounce-in max-w-[90vw]">
            {toast}
          </div>
        )}

        <div data-aos="fade-up" data-aos-delay="300">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare size={18} className="text-accent" />
            <h3 className="text-lg font-semibold font-poppins text-textMain">Recent Messages</h3>
            <span className="ml-auto text-xs text-textMain/40">{messages.length} messages</span>
          </div>

          <GuestbookMessageList
            messages={messages}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            replyingTo={replyingTo}
            replyBody={replyBody}
            isReplying={isReplying}
            likedMessages={likedMessages}
            onLike={handleLike}
            onReplyToggle={setReplyingTo}
            onReplyBodyChange={setReplyBody}
            onReplySubmit={handleReplySubmit}
            onPageChange={setCurrentPage}
            timeAgo={timeAgo}
          />
        </div>
      </div>
    </section>
  );
};

export default Guestbook;
