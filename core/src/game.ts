import { create, StateCreator } from 'zustand'
import { immer } from 'zustand/middleware/immer'

function Component<TInterface>(props: StateCreator<
  TInterface,
  [],
  [],
  TInterface
>) {

}

export const Store =
  <TGame, TState>
    (initializer: StateCreator<TGame, [["zustand/immer", never]], [], TState>) => initializer

const bear = Component<IBearComponent>((set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
}))

interface IBearComponent {
  bears: number
  addBear: () => void
  eatFish: () => void
}

interface IFishComponent {
  fishes: number
  addFish: () => void
}

interface IGame {
  addBoth: () => void
  getBoth: () => void
}

const createFishSlice: StateCreator<
  IBearComponent & IFishComponent,
  [],
  [],
  IFishComponent
> = 
const createSharedSlice: StateCreator<
  IBearComponent & IFishComponent,
  [],
  [],
  IGame
> = (set, get) => ({
  addBoth: () => {
    // you can reuse previous methods
    get().addBear()
    get().addFish()
    // or do them from scratch
    // set((state) => ({ bears: state.bears + 1, fishes: state.fishes + 1 })
  },
  getBoth: () => get().bears + get().fishes,
})

const game = create<IBearComponent & IFishComponent & IGame>()((...a) => ({
  bear: bear(...a),
  ...createFishSlice(...a),
  ...createSharedSlice(...a),
}))