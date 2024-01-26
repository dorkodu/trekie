import { useTrekieStore } from "./lib/store"

interface Config { }

export class Trekie {
  constructor({ }: Config) {

  }

  store = useTrekieStore
}

const trekie = new Trekie({})

