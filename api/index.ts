import { appRouter } from '@/router'
import { createContext } from '@/trpc'
import express from "express"
import * as trpcExpress from '@trpc/server/adapters/express'

const app = express()
const port = 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connect tRPC to Express
app.get("/", (req, res) => {
  res.send("✪ Welcome to the Trekie API!")
})

// Connect tRPC to Express
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
