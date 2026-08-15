import { app } from "./app.js";
import { prisma } from "./config/prisma.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, () => {
  console.log(`✅ API: http://localhost:${env.PORT}/api`);
  console.log(`✅ Swagger: http://localhost:${env.PORT}/api/docs`);
});

async function shutdown(signal: string): Promise<void> {
  console.log(`\n${signal} received. Closing server...`);

  server.close(async () => {
    await prisma.$disconnect();

    console.log("Server closed");
    process.exit(0);
  });
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});