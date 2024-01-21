import { immer } from 'zustand/middleware/immer';
import { create } from 'zustand';
import { IHabit } from './types';

export interface IState { }

export interface IEventStatus {
  kind: EventKindName;
  timestamp: number;
  props: any;
}

interface IEventKind<T = any> {
  onCreate: (props: T) => IEventStatus;
  onTrigger: (state: IState, event: IEventStatus) => void;
}

type EventKindName = string

type ShortTheMarketProps = { capital: number, leverage: number }


interface CellProps {
  name: string,
  events: Record<string, IEventKind>
}

function Cell<TState = {}>(props: CellProps) {
  return {
    ...props,

    createEvent<T extends EventKindName>(kind: T, props: Parameters<typeof this.events[T]["onCreate"]>[0]) {
      return this.events[kind].onCreate(props as any)
    },

    triggerEvent(event: IEventStatus, state: IState) {
      this.events[event.kind].onTrigger(state, event)
    }
  }
}

const EventKind = <Props>(kind: IEventKind<Props>): IEventKind<Props> => kind



const CreateHabit = EventKind<{ name: string, }>({
  onCreate: (props) => ({
    kind: "ISayHello",
    timestamp: Date.now(),
    props,
  }),
  onTrigger: (state, event) => {
    const props: ISayHello = event.props;
    console.log(props.message)
  },
})

const Habit = Cell({
  name: "habit",
  events: {
    CreateHabit,

    ShortTheMarket: EventKind({
      onCreate: (props) => ({
        kind: "ShortTheMarket",
        timestamp: Date.now(),
        props,
      }),
      onTrigger: (state, event) => {
        const props: ShortTheMarketProps = event.props;
        console.log(props.capital)
        console.log(props.leverage)
      },
    }),
  }
})

function 

function

  createEvent("Example", { message: "anan" })

const $_COOKIE = createEvent("ShortTheMarket", { capital: 31, leverage: 69 })
const state: IState = {}

triggerEvent($_COOKIE, state)

export default { createEvent, triggerEvent, Cell }