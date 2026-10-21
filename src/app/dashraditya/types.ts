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

export type DashboardTab = 'GUESTBOOK' | 'PROJECTS';

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  techStack: string[];
  demoUrl?: string | null;
  githubUrl?: string | null;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ToastState {
  message: string;
  type: 'success' | 'error';
}
