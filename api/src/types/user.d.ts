export interface IUser {
  id: string;

  username: string;
  name: string;

  bio?: string;

  followers: number;
  following: number;

  follower?: boolean;
  following?: boolean;

  premium?: boolean;
}