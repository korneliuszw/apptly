import { OpenAPI, auth } from "@apptly/auth";
import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { applicationController } from "./controller/applicationController";
import { profileController } from "./controller/profileController";
import errorHandler from "./middleware/errorHandler";
import {cors} from "@elysiajs/cors";
import { planController } from "./controller/planController";

const app = new Elysia()
	.use(errorHandler)
	.use(process.env.FRONTEND_URL ? cors({
		origin: process.env.FRONTEND_URL,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		credentials: true,
		allowedHeaders: ["Authorization", "Content-Type"],
	}) : cors())
	.use(
		openapi({
			documentation: {
				components: await OpenAPI.components,
				paths: await OpenAPI.getPaths(),
			},
		}),
	)
	.mount("/auth", auth.handler)
	.use(profileController)
	.use(applicationController)
	.use(planController)
	.get("/hello", () => "Hello World!")
	.listen(3000);

export type App = typeof app;

console.log("OpenAPI docs available at http://localhost:3000/openapi");
