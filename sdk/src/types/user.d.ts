export interface IUser {
  id: string;

  username: string;
  name: string;
  email?: string;

  bio?: string;

  joinedAt: Date;

  /** Includes habits over-done. */
  xp: number;
  
  /** Excludes habits over-done (maximum amount of daily xp can be equal to daily xp target). */
  dailyXpCurrent: number;
  dailyXpTarget: number;

  lastXpDate: Date;

  streaks: number;
  lastStreakDate?: Date;

  followerCount: number;
  followingCount: number;
  
  premium?: boolean;
}