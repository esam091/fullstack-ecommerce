import { db, connection } from "@/server/db";
import { migrate } from "drizzle-orm/mysql2/migrator";

await migrate(db, { migrationsFolder: "./migrations" });

await connection.end();
