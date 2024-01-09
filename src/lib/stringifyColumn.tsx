import { sql } from "drizzle-orm";

export function stringifyColumn<T>(column: T) {
  return sql<string>`CAST(${column} as char)`;
}
