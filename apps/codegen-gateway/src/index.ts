import { Elysia, t, file } from "elysia";
import { serviceFactory } from "./serviceFactory";
import { knownCommands, MessageResponseSchema } from "./types";
import { createAppArtifact, initApp } from "./appService";
import { logger } from "@bogeychan/elysia-logger";
import { Agent } from "./agent";

const app = new Elysia()
	.use(logger())
	.decorate("agent", await Agent.create())
	.ws("/ws", {
		body: t.Object({
			message: t.Object({
				command: t.String({ enum: knownCommands }),
				content: t.String(),
			}),
		}),
		query: t.Object({
			id: t.String({ format: "uuid" }),
		}),
		response: t.Object({
			id: t.String({ format: "uuid" }),
			response: t.Union([MessageResponseSchema, t.String()]),
			timestamp: t.Number(),
		}),
		open(ws) {
			console.log("WebSocket connection opened");
			ws.send({
				id: ws.data.query.id,
				response: "Connection established. Ready to receive commands.",
				timestamp: Date.now(),
			});
		},
		async message(ws, { message: { command, content } }) {
			const controller = serviceFactory(command);
			if (!controller) {
				ws.send({
					id: ws.data.query.id,
					response: `Unknown command: ${command}`,
					timestamp: Date.now(),
				});
				return;
			}
			const generator = controller(content, { agent: ws.data.agent });
			for await (const response of generator) {
				ws.send({
					id: ws.data.query.id,
					response,
					timestamp: Date.now(),
				});
			}
		},
		close() {
			console.log("WebSocket connection closed");
		},
	})
	.post("/init", async ({ status }) => {
		const initResult = await initApp();
		if (initResult === "APP_ALREADY_INITIALIZED") {
			return status(400, { error: "App is already initialized." });
		}
		return { message: "App initialized successfully." };
	})
	.get("/artifact", async () => {
		const artifactPath = await createAppArtifact();
		return file(artifactPath);
	})
	.listen(3002);

console.log("Codegen Gateway is running on http://localhost:3002");

export type App = typeof app;
