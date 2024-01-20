import { useTrekieStore } from "#/stores/trekieStore";
import { IHabit } from "@sdk/types";

interface IEvent {
  kind: string
  timestamp: Date
  context: IContext
  data: any
  onTrigger: () => void
}

type IContext = {}
type IAction = (input: any, state: IGameState) => IEvent

// our first action ever!
const createHabit: IAction = function (habit: IHabit, state: IGameState): IEvent {

  // here do something with state
  // mutate the state, update things etc.

  return {
    kind: "habit:create",
    timestamp: new Date(),
    context: {},
    data: {},
    onTrigger(event: IEvent, state: IGameState) {
      console.log("new habit: " + event.data)
    }
  }
}


/**
 * We have actions
 */

type EventKind = keyof typeof events;

interface IGameState { }

// action(input, state)
// - takes input, creates output
// - mutates the state
// 

interface TrekieConfig { }

class Trekie {
  constructor({ }: TrekieConfig) { }

  public components = {
    habit: {},
    goal: {},
    story: {},
  }
}

export const trekie = new Trekie({})


// Usage
useTrekieStore.setState(s => {
  trekie.habit.create.(s.habits, someOtherParam)
})