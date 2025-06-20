import type { Game } from "."
import { daystamp, utils } from "@sdk"

export function changeXp(game: Game, change: number) {
  game.setState($ => {
    let newTotalXp = $.xp + change
    let newDailyXp = $.xpToday() + change
    // prevent negative xp
    if (newTotalXp < 0)
      newTotalXp = 0
    $.xp = newTotalXp
    // add XP to history
    $.xpHistory[daystamp.today()] = newDailyXp
    // USE LATER: console.log(Object.fromEntries(Object.entries($.xpHistory).map(([k, v]) => [k, v])))
    // Handle user's last xp date
    if (!utils.isSameDay($.lastXp, Date.now()))
      $.lastXp = Date.now()
  })
  game.getState().refresh()
  return game.getState().xp
}

export function changeCoinsBalance(change: number) {
  game.setState($ => {
    let newTotalCoins = $.coins + change
    // prevent negative coins
    if (newTotalCoins < 0)
      newTotalCoins = 0
    $.coins = newTotalCoins
  })
  game.getState().refresh()
  return game.getState().coins
}

function changeDailyTarget(target: number) {
  game.setState($ => {
    // prevent negative target
    if (target < 0) target = 0
    $.dailyTarget = target
  })
  game.getState().refresh()
  return game.getState().dailyTarget
}