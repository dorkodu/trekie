import { randomBytes } from "crypto"

const uniq = () => crypto.subtle.digest("sha256", randomBytes(64))

const ID = {
  habit: () => (`trekie:habit:${uniq()}`),
  user: () => (`trekie:user:${uniq()}`),
  goal: () => (`trekie:goal:${uniq()}`),
  story: () => (`trekie:story:${uniq()}`),
}

export default ID