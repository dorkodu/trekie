import { appRouter } from '@/router'
import { createContext } from '@/trpc'
import express from "express"
import * as trpcExpress from '@trpc/server/adapters/express'

const app = express()
const port = 3131

app.use(express.json())

app.get("/", (req, res) => {
  res.send("✪ Welcome to the Trekie API!")
})

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
)

app.listen(port, () => {
  console.log(`TREKIE API ▶ Starting...`)
  console.log(`TREKIE API ▶ Listening on http://localhost:${port}`)
})
