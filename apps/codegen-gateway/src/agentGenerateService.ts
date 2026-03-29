import type { Service, ServiceResponse, State } from "./types";
import type { Todo } from "@opencode-ai/sdk";

export const agentGenerateService = async function* (
	content: string,
	state: State,
): Service {
	const { stream } = await state.agent.stream();
	let isResolved = false;
	const service = state.agent.sendTextPrompt(content).then((res) => {
		isResolved = true;
		return res;
	});
	for await (const message of stream) {
		console.log("Received message from agent stream:", message);
		switch (message.type) {
			case "session.error": {
				yield {
					type: "error",
					content: `Agent execution error: ${message.properties.error?.name}`,
				} as ServiceResponse;
				return;
			}
			// @ts-expect-error - these events are not typed yet
			case "server.heartbeat":
			case "session.idle": {
				if (!isResolved) continue;
				const response = await service;
				yield {
					type: "finished",
					content: `Agent execution finished. Final output: ${JSON.stringify(response.data ?? {})}`,
				} as ServiceResponse;
				return;
			}
			case "todo.updated": {
				console.log("Received todo.updated event:", message);
				const todos = message.properties.todos
					.map(
						(todo: Todo) =>
							`[${todo.status === "completed" ? "X" : todo.status === "canceled" ? "C" : " "}] ${todo.content} ${todo.status === "in_progress" ? "..." : ""} `,
					)
					.join("\n");
				yield {
					type: "task_progress",
					content: `Agent plan updated. \nTodos:\n${todos}`,
				} as ServiceResponse;
			}
		}
	}
};
