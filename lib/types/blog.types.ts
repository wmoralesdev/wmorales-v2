export type BlogPost = {
  slug: string;
  entry: {
    title: string;
    description: string;
    publishedAt: string;
    featured: boolean;
    tags: string[];
    coverImage: string;
    content: () => Promise<unknown>;
  };
};

export type CommentWithReplies = {
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
};

export type NotificationType = {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  entityType: string;
  entityId: string;
  triggerUserId: string | null;
  triggerCommentId: string | null;
  metadata: Record<string, unknown>;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
};
