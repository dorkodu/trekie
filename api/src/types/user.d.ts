export interface IUser {
  id: string;

  username: string;
  name: string;

  bio?: string;

  joinDate: number;

  /** Excludes habits over-done (maximum amount of daily xp can be equal to daily xp target). */
  dailyXpCurrent: number;
  dailyXpTarget: number;
  /** Includes habits over-done. */
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