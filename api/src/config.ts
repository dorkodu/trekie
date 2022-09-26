import { config as dotenv } from "dotenv";

import * as path from "path";

dotenv({ path: path.join(__dirname, "../.env") });

const port = (process.env.PORT && parseInt(process.env.PORT)) || 80;

export const config = {
  port,
}
