import { OpenAPI } from "@apptly/auth";
import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { profileController } from "./controller/profileController.js";

const app = new Elysia()
	.use(
		openapi({
			documentation: {
				components: await OpenAPI.components,
				paths: await OpenAPI.getPaths(),
			},
		}),
	)
	.use(profileController)
	.get("/hello", () => "Hello World!")
	.listen(3000);

export type App = typeof app;

console.log("OpenAPI docs available at http://localhost:3000/openapi");
