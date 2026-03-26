import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sql";
// biome-ignore lint/style/noNonNullAssertion: This is required for drizzle to work, and we ensure it's set in the config
export const db = drizzle(process.env.DATABASE_URL!, {
	casing: "snake_case",
	logger: true,
});
db.select()
	.from(sql`pg_tables`)
	.then((result) => {
		console.debug("Connected to database successfully");
	});
