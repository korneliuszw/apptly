import { drizzle } from "drizzle-orm/node-postgres";

// biome-ignore lint/style/noNonNullAssertion: This is required for drizzle to work, and we ensure it's set in the config
export const db = drizzle(process.env.DATABASE_URL!, { casing: "snake_case" });
