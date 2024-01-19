interface IEvent {
  kind: EventKind;
  timestamp: Date;
}

interface IEventData {
  xp: number,
  coin: number,
  momentum: number,
  streak: number,

  onTrigger: () => void;
}

type EventKind = keyof typeof events;

const events = {
  habit: {
    create: (xp: number, coin: number, momentum: number, streak: number): IEventData => ({
      xp,
      coin,
      momentum,
      streak,

      onTrigger(habits: IHabit[] /* Habits from the zustand store */, otherParams: any) {
        // Perform changes on the habit,
        // Send request to server, etc.
      },
    }),
  }

}

// Usage
useStore.setState(s => {
  events.habit.create.(s.habits, someOtherParam)
})

class Trekie {

  constructor() { }
}