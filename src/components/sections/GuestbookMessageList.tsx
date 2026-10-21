'use client';

import Image from 'next/image';
import { Heart, Reply, Clock, User, ChevronLeft, ChevronRight, Send } from 'lucide-react';

interface GuestbookMessage {
  id: string;
  body: string;
  author_name: string;
  avatar_url: string | null;
  createdAt: string;
  likes: number;
  replies?: GuestbookMessage[];
}

interface MessageListProps {
  messages: GuestbookMessage[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  replyingTo: string | null;
  replyBody: string;
  isReplying: boolean;
  likedMessages: Set<string>;
  onLike: (id: string) => void;
  onReplyToggle: (id: string | null) => void;
  onReplyBodyChange: (val: string) => void;
  onReplySubmit: (e: React.FormEvent, parentId: string) => void;
  onPageChange: (page: number) => void;
  timeAgo: (dateStr: string) => string;
}

const MAX_CHARS = 500;

const ReplyCard = ({
  reply,
  likedMessages,
  onLike,
  timeAgo,
}: {
  reply: GuestbookMessage;
  likedMessages: Set<string>;
  onLike: (id: string) => void;
  timeAgo: (dateStr: string) => string;
}) => (
  <div className="relative bg-surface shadow-neu-out rounded-2xl p-4 z-10">
    <div className="flex items-center gap-2 mb-2">
      {reply.avatar_url ? (
        <Image src={reply.avatar_url} alt={reply.author_name} width={24} height={24} className="rounded-full border border-accent/20" />
      ) : (
        <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
          <User size={10} className="text-accent" />
        </div>
      )}
      <p className="flex-1 min-w-0 text-xs font-semibold text-textMain truncate">{reply.author_name}</p>
      <div className="flex items-center gap-1 text-textMain/35 shrink-0">
        <Clock size={10} />
        <span className="text-[10px]">{timeAgo(reply.createdAt)}</span>
      </div>
    </div>
    <p className="text-xs text-textMain/80 leading-relaxed pl-8 mb-3">{reply.body}</p>
    <div className="flex items-center gap-4 pl-8">
      <button
        onClick={() => onLike(reply.id)}
        disabled={likedMessages.has(reply.id)}
        className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${likedMessages.has(reply.id) ? 'text-red-500' : 'text-textMain/50 hover:text-red-500'}`}
      >
        <Heart size={12} className={likedMessages.has(reply.id) ? 'fill-red-500' : ''} />
        <span>{reply.likes > 0 ? reply.likes : 'Like'}</span>
      </button>
    </div>
  </div>
);

export const GuestbookMessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  currentPage,
  totalPages,
  replyingTo,
  replyBody,
  isReplying,
  likedMessages,
  onLike,
  onReplyToggle,
  onReplyBodyChange,
  onReplySubmit,
  onPageChange,
  timeAgo,
}) => {
  const paginatedMessages = messages.slice(
    (currentPage - 1) * 3,
    currentPage * 3
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface shadow-neu-out rounded-2xl p-5 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-surface shadow-neu-in" />
              <div className="h-3 w-24 rounded-full bg-surface shadow-neu-in" />
            </div>
            <div className="h-3 w-full rounded-full bg-surface shadow-neu-in mb-2" />
            <div className="h-3 w-2/3 rounded-full bg-surface shadow-neu-in" />
          </div>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-12 text-textMain/40">
        <p className="text-sm">No messages yet. Be the first! 🎉</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {paginatedMessages.map((msg) => (
          <div key={msg.id} className="space-y-3">
            <div className="bg-surface shadow-neu-out rounded-2xl p-5 hover:shadow-[10px_10px_20px_rgba(150,175,161,0.8),-10px_-10px_20px_rgba(255,255,255,1)] transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-2.5">
                {msg.avatar_url ? (
                  <Image src={msg.avatar_url} alt={msg.author_name} width={32} height={32} className="rounded-full border-2 border-accent/20" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <User size={14} className="text-accent" />
                  </div>
                )}
                <p className="flex-1 min-w-0 text-sm font-semibold text-textMain truncate">{msg.author_name}</p>
                <div className="flex items-center gap-1 text-textMain/35 shrink-0">
                  <Clock size={11} />
                  <span className="text-[11px]">{timeAgo(msg.createdAt)}</span>
                </div>
              </div>
              <p className="text-sm text-textMain/80 leading-relaxed pl-11 mb-4">{msg.body}</p>
              <div className="flex items-center gap-4 pl-11">
                <button
                  onClick={() => onLike(msg.id)}
                  disabled={likedMessages.has(msg.id)}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${likedMessages.has(msg.id) ? 'text-red-500' : 'text-textMain/50 hover:text-red-500'}`}
                >
                  <Heart size={14} className={likedMessages.has(msg.id) ? 'fill-red-500' : ''} />
                  <span>{msg.likes > 0 ? msg.likes : 'Like'}</span>
                </button>
                <button
                  onClick={() => onReplyToggle(replyingTo === msg.id ? null : msg.id)}
                  className="flex items-center gap-1.5 text-xs font-medium text-textMain/50 hover:text-accent transition-colors"
                >
                  <Reply size={14} />
                  <span>Reply</span>
                </button>
              </div>
            </div>

            {replyingTo === msg.id && (
              <div className="pl-12 pr-4 py-2">
                <form onSubmit={(e) => onReplySubmit(e, msg.id)} className="flex gap-2">
                  <input
                    type="text"
                    value={replyBody}
                    onChange={(e) => onReplyBodyChange(e.target.value)}
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

            {msg.replies && msg.replies.length > 0 && (
              <div className="mt-2 space-y-4">
                {msg.replies.map((reply, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === msg.replies!.length - 1;
                  return (
                    <div key={reply.id} className="relative ml-9 pl-5 md:pl-10">
                      <div
                        className="absolute left-0 border-l-[3px] border-textMain/20 -z-10"
                        style={{ top: isFirst ? '-1.5rem' : '-1rem', height: isFirst ? '3rem' : '2.5rem' }}
                      />
                      <div className="absolute left-0 top-[1.5rem] w-5 md:w-10 h-4 border-l-[3px] border-b-[3px] border-textMain/20 rounded-bl-xl -z-10" />
                      {!isLast && (
                        <div className="absolute left-0 border-l-[3px] border-textMain/20 -z-10" style={{ top: '2.5rem', bottom: '0' }} />
                      )}
                      <ReplyCard reply={reply} likedMessages={likedMessages} onLike={onLike} timeAgo={timeAgo} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-surface shadow-neu-out hover:shadow-neu-in disabled:opacity-30 disabled:cursor-not-allowed transition-all text-textMain"
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium text-textMain/70 font-poppins">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-surface shadow-neu-out hover:shadow-neu-in disabled:opacity-30 disabled:cursor-not-allowed transition-all text-textMain"
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </>
  );
};
