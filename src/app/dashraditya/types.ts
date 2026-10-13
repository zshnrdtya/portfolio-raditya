export interface PendingMessage {
  id: string;
  body: string;
  author_name: string;
  avatar_url: string | null;
  createdAt: string;
  parentId: string | null;
  parent?: {
    author_name: string;
  } | null;
}

export type FilterType = 'ALL' | 'MAIN' | 'REPLIES';

export interface ToastState {
  message: string;
  type: 'success' | 'error';
}
