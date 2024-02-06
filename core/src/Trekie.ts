import { useStore } from "./lib/store"

interface Config { }

export class Trekie {
  constructor({ }: Config) {

  }

  updateStats() { }

  store = useStore
}

const trekie = new Trekie({})

