import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as staticCompressed from "express-static-gzip";

import * as path from "path";

import { config } from "./config";

const app = express();
const staticFiles = staticCompressed(path.join(__dirname, "../../web/dist"), { enableBrotli: true });

app.use(cookieParser());
app.use(express.json());
app.use("/", staticFiles);

// Authorization middleware
app.use(async (_req, _res, next) => { next(); });

// Routes

// Catch all other routes
app.use("*", staticFiles);

app.listen(config.port, () => { console.log(`Server has started on port ${config.port}`) })
