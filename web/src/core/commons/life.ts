import { IUser } from "../Trekie"

export interface ILife {
  id: string
  ownerId: string
  user?: IUser
  stories: IStory[]
}

export interface IStory {
  id: string
  kind: IStoryKind
  userId: string
  date: Date

  text: string
  mediaURL: string

  likes: number
  likedByMe?: boolean
}

export enum IStoryKind {
  Photo,
  Text,
  Mixed,
}

export function calculateStreak(
  xpHistory: { [date: string]: number },
  dailyXpTarget: number
): number {
  // Helper function to convert date strings in "dd-MM-yyyy" format to Date objects
  const toDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Step 1: Filter dates that meet or exceed the daily XP target, convert to Date objects, and sort in ascending order
  const dates = Object.keys(xpHistory)
    .filter(date => xpHistory[date] >= dailyXpTarget)
    .map(toDate)
    .sort((a, b) => a.getTime() - b.getTime());

  // Step 2: If no valid dates, return a streak of 0
  if (dates.length === 0) return 0;

  let streak = 1; // Initialize the streak count

  // Step 3: Calculate the streak by checking consecutive dates
  for (let i = dates.length - 1; i > 0; i--) {
    const diffDays = (dates[i].getTime() - dates[i - 1].getTime()) / (1000 * 60 * 60 * 24);

    // If the difference is exactly 1 day, increment the streak
    if (diffDays === 1) {
      streak++;
    } else {
      break; // If the difference is more than 1 day, the streak is broken
    }
  }

  return streak; // Step 4: Return the calculated streak
};