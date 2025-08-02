import { cors } from "@elysiajs/cors";
import { Elysia } from 'elysia';
import { db, initDb } from './db';
import { router } from './router';
import { loadNamespaceEndpoints } from './utils/loadNamespaces';

const app = new Elysia()
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}))

app.decorate('db', db);
app.get('/', () => 'Hello World')
app.post("/echo", ({ body }) => {
  return body;
})
app.onRequest(({ request }) => {
  console.log(`[GLOBAL] ${request.method} ${request.url}`);
});

function logTrpcRoutes(router: any, prefix = "") {
  for (const [key, value] of Object.entries(router._def.procedures)) {
    if (
      value &&
      typeof value === "object" &&
      "_def" in value &&
      (value as any)._def?.procedures
    ) {
      logTrpcRoutes(value, `${prefix}${key}.`);
    } else {
      console.log(`tRPC route: ${prefix}${key}`);
    }
  }
}

async function main() {
  await initDb();
  await loadNamespaceEndpoints(app);
  app.routes.forEach(r => {
    console.log(`[${r.method}] ${r.path}`);
  });

  app.listen(8000);
  logTrpcRoutes(router);
  console.log('🚀 Server is running at http://localhost:8000');
}

main();