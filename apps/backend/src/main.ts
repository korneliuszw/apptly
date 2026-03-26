import { OpenAPI } from "@apptly/auth";
import { logger } from "@bogeychan/elysia-logger";
import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { applicationController } from "./controller/applicationController.js";
import { profileController } from "./controller/profileController.js";

const app = new Elysia()
	.use(logger())
	.use(
		openapi({
			documentation: {
				components: await OpenAPI.components,
				paths: await OpenAPI.getPaths(),
			},
		}),
	)
	.onError((ctx) => {
		const id = crypto.randomUUID();
		ctx.log?.error(ctx, `[ID: ${id}]`);
		if (ctx.code === "UNKNOWN") {
			console.error(ctx.error);
			return ctx.status(
				500,
				`Internal Server Error. Please contact support with the error ID: ${id}.`,
			);
		}
	})
	.use(profileController)
	.use(applicationController)
	.get("/hello", () => "Hello World!")
	.listen(3000);

export type App = typeof app;

console.log("OpenAPI docs available at http://localhost:3000/openapi");
