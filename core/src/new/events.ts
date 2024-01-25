import { Cell, EventKind, IEvent, IStatus } from "#/lib/supercell"

const SendMessage = EventKind<{ text: string }>({
  onCreate: (data) => ({ kind: "SendMessage", timestamp: Date.now(), data }),
  onShare: (status) => { },
})

const ShortMarket = EventKind<{ kaldirac: number }>({
  onCreate: (data) => ({ kind: "SendMessage", timestamp: Date.now(), data }),
  onShare: (status) => { },
})



const Telegram = Cell({ SendMessage, ShortMarket })
const margincall = Telegram.status("ShortMarket", { kaldirac: 100 })
