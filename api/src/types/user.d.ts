export interface IUser {
  id: string;

  joinDate: number;

  username: string;
  name: string;

  bio?: string;

  followerCount: number;
  followingCount: number;

  /** Target user subscribing to the current user. */
  follower?: boolean;
  /** Current user subscribing to the target user. */
  following?: boolean;

  premium?: boolean;
}