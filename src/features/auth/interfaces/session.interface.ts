export interface NextAuthSession {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    avatar?: string | null;
    role?: string | null;
  };
}
