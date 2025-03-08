export interface Item {
  id: string
  name: string
  description: string
  price: number
  image: string
  effect?: string
  duration?: string
}

export interface UserInventory {
  powerUps: {
    [key: string]: number
  }
}
