export interface IUser {
  id: string;

  username: string;
  name: string;
  joinedAt: Date;

  email?: string;

  bio?: string;

  pictureUrl?: string;

  followerCount?: number;
  followingCount?: number;

  premium?: boolean;
}