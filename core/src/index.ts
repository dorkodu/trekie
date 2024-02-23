export * as Trekie from './Trekie';

import * as Trekie from './Trekie';

import * as Goal from "./commons/goal"
import * as Habit from "./commons/habit"

const initialState: Trekie.GameState = {
  // points
  xp: 0,
  coins: 0,
  momentum: 0,
  streak: 0,

  // dailies
  xpTargetDaily: 5,
  xpToday: 0,
  dailyProgress: 20,

  // timestamps
  lastXp: 1703846675440,
  lastStreak: 1703846675432,
  lastActive: 1703846675432,

  user: {
    id: '1',
    username: 'dorukeray',
    name: 'Doruk Eray',
    bio: 'Founder, Polymath, Craftsman.',
    email: 'doruk@dorkodu.com',
    pictureUrl: '/images/doruk--green.png',
    premium: true,
    joinedAt: new Date(1703846675432),
    followerCount: 0,
    followingCount: 0,
  },
}

const game = Trekie.Game(initialState)

const trekie = {
  game,
  goal: Goal.Component(game),
  habit: Habit.Component(game),
}

export default trekie

let xp = trekie.game($ => $.xp)

let myFirstHabit = trekie.habit.create({
  title: "Do Pushups Everyday",
  description: "At least 50 pushups to get stronger.",
  dailyTarget: 50,
})

if (myFirstHabit) trekie.habit.add(myFirstHabit)

trekie.habit.commit("xxxx-xxxx-xxxx-xxxx", 100)

let myFirstGoal = trekie.goal.create({
  title: "Become A Billionaire Until 25",
  description: "Liquior, Ladies, Leverage. IYKYK.",
  xpTarget: 5000,
})