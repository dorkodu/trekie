import { sha256 } from '@noble/hashes/sha256';
import { base58 } from '@scure/base';



function unique() {
  const timestamp = Date.now().toString()
  const random = crypto.getRandomValues(new Uint32Array(1)).toString()
  // we mix timestamp with random bytes to increase uniqueness :)
  const hash = sha256(`${timestamp}:${random}`)

  return hash.toString()
}

const id = (namespace: string, label: string) => {
  return base58.encode(
    // Convert utf8 string to Uint8Array
    new TextEncoder().encode(`${namespace}:${label}:${unique()}`)
  )
}

export const DorkoduID = { unique, id }

import { uuidv7obj } from "uuidv7";

const object = uuidv7obj(); pre
console.log(String(object)); // e.g., "017fea6b-b877-7aef-b422-57db9ed15e9d"

export const ID = {
  habit: () => id('trekie', 'habit'),
  user: () => id('trekie', 'user'),
  goal: () => id('trekie', 'goal'),
  story: () => id('trekie', 'story'),
}