import { type GameInterface } from "."
import { daystamp } from "../../utils"

// Function to calculate the current streak based on xpHistory and dailyXpTarget
export function calculateStreak(
  xpHistory: GameInterface["xpHistory"], // { [date: Daystamp]: number }
  dailyXpTarget: number
): number {
  let currentDate = new Date()
  currentDate.setDate(currentDate.getDate() - 1) // Start from yesterday
  let streak: number = 0 // Initialize the streak count

  // Loop through each day in reverse, checking if the XP meets the daily target
  while (true) {
    const dateString = daystamp.fromDate(currentDate) // Convert the date to the required format
    const xp = xpHistory[dateString] // Get the XP for the current date

    // If the XP meets or exceeds the daily target, increment the streak
    if (xp && xp >= dailyXpTarget) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1) // Move to the previous day
    } else {
      break // If the XP doesn't meet the target, break the loop
    }
  }

  // Check if today's XP meets or exceeds the daily target
  const todaysXp = xpHistory[daystamp.fromDate(new Date())]
  if (todaysXp && todaysXp >= dailyXpTarget) {
    streak++
  }

  return streak // Return the calculated streak
}

