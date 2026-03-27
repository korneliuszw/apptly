import { OpenAPI } from "@apptly/auth";
import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { applicationController } from "./controller/applicationController";
import { profileController } from "./controller/profileController";
import errorHandler from "./middleware/errorHandler";

const app = new Elysia()
	.use(errorHandler)
	.use(
		openapi({
			documentation: {
				components: await OpenAPI.components,
				paths: await OpenAPI.getPaths(),
			},
		}),
	)
	.use(profileController)
	.use(applicationController)
	.get("/hello", () => "Hello World!")
	.listen(3000);

export type App = typeof app;

console.log("OpenAPI docs available at http://localhost:3000/openapi");
