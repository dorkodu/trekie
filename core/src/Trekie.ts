import { useStore } from "./lib/store"

interface Config { }

export class Trekie {
  constructor({ }: Config) {

  }

  store = useStore
}

const trekie = new Trekie({})

