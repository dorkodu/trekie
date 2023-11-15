import { config } from "./config";
import { schema } from "./controllers/_schema";
import { express } from "./lib/express";
import { server } from "./lib/server";
import "./lib/socketio";

async function main() {
  express.use("/api", async (req, res, next) => {
    try {
      res.status(200).send(await schema.execute(() => ({ req, res, next }), req.body));
    } catch {
      res.status(500).send();
    }
  });

  server.listen(config.port, () => { console.log(`Server has started on port ${config.port}`) });
}

main();