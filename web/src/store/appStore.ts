import create from "zustand"
import { immer } from 'zustand/middleware/immer'

interface State {
  test: boolean;

  setTest: (test: boolean) => void;
}

export const useAppStore = create(immer<State>((set) => ({
  test: false,

  setTest: (test) => set((state: State) => {
    state.test = test;
  }),
})))
