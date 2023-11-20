export interface IUser {
  id: string;

  username: string;
  name: string;

  bio?: string;

  joinDate: number;

  dailyXpTarget: number;
  dailyXpCurrent: number;
  totalXp: number;

  streaks: number;
  lastStreakDate?: number;

  followerCount: number;
  followingCount: number;

  /** Target user subscribing to the current user. */
  follower?: boolean;
  /** Current user subscribing to the target user. */
  following?: boolean;

  premium?: boolean;
}