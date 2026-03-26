import { defineConfig } from "drizzle-kit";

console.debug("DATABASE_URL", process.env.DATABASE_URL);
export default defineConfig({
	out: "./drizzle",
	schema: "./src/lib/schema",
	dialect: "postgresql",
	dbCredentials: {
		// biome-ignore lint/style/noNonNullAssertion: This is required for drizzle to work, and we ensure it's set in the config
		url: process.env.DATABASE_URL!,
	},
});
