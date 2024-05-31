import { db } from "@/server/db";
import { migrate } from "drizzle-orm/vercel-postgres/migrator";

try {
  await migrate(db, { migrationsFolder: "./migrations" });
} catch (error) {
  console.error(error);
}

// await connection.end();
