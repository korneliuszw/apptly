import { authSchema, db } from "@apptly/db/src/index";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
export const auth = betterAuth({
	basePath: "/api",
	emailAndPassword: {
		enabled: true,
	},
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: authSchema,
	}),
	plugins: [openAPI()],
});
