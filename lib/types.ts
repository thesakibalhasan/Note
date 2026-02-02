export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  isArchived: boolean;
  isTrashed: boolean;
  images: string[];
  password?: string;
  isPasswordProtected: boolean;
}

export interface FirebaseNote {
  id?: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  isArchived: boolean;
  isTrashed: boolean;
  images: string[];
  password?: string;
  isPasswordProtected: boolean;
}
