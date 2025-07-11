export interface BlogPost {
  slug: string;
  entry: {
    title: string;
    description: string;
    publishedAt: string | null;
    featured: boolean;
    tags: readonly string[];
    coverImage: string;
    content: () => Promise<any>;
  };
}

export interface CommentWithReplies {
  id: string;
  slug: string;
  userId: string;
  userName: string;
  content: string;
  parentId: string | null;
  depth: number;
  isEdited: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  score: number;
  userVote: number | null;
  replies: CommentWithReplies[];
}

export interface NotificationType {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  entityType: string;
  entityId: string;
  triggerUserId: string | null;
  triggerCommentId: string | null;
  metadata: any;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
}