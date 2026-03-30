import { getApiClient, getSocketConnector } from "@apptly/gateway-socket/src";
import {
	completeGeneration,
	getPlanById,
	updateGenerationProgress,
} from "../repository/generationRepository";
import { generationEvents } from "./tasks/events";
import { finishGenerationTask } from "./tasks/finishGenerationTask";
import { removeContainerTask } from "./tasks/containerTask";

declare var self: Worker;

const START_GENERATION_DELAY = 5000; // 5 seconds

export class GenerationTask {
	private _generationId: string;
	private _planId: string;
	private _host: string;
	private _socket: ReturnType<typeof getSocketConnector> | null = null;

	constructor(generationId: string, planId: string, host: string) {
		this._generationId = generationId;
		this._planId = planId;
		this._host = host;
	}

	get generationId() {
		return this._generationId;
	}

	public start() {
		setTimeout(() => this._runTask(), START_GENERATION_DELAY);
	}

	private async _runTask() {
		const api = getApiClient(`http://${this._host}`);
		const [{ plan }] = await getPlanById(this._planId);
		const res = await api.init.post();
		console.log(
			`Sent init request to generation container for plan ${this._planId}`,
			res,
		);
		const socket = getSocketConnector(`http://${this._host}`, this._planId);
		this._socket = socket;
		socket.subscribe((message) =>
			this._onSocketMessage(message as unknown as MessageResponseSchema),
		);
		socket.on("close", this._onSocketClose.bind(this));
		socket.on("open", this._onSocketOpen.bind(this, plan));
	}
	private _onSocketClose(e: CloseEvent) {
		console.log(
			"WebSocket connection closed for generation task",
			this._generationId,
		);
		console.error("WebSocket closed with event:", e);
	}
	private _onSocketOpen(plan: string) {
		console.log(
			"WebSocket connection opened for generation task",
			this._generationId,
		);
		this._socket?.send({
			message: {
				command: "generate",
				content: plan,
			},
		});
	}
	private async _onSocketMessage(message: MessageResponseSchema) {
		console.log("Received message from agent stream:", message);
		console.assert(this._generationId, "Generation ID is not set for the task");
		switch (message.type) {
			case "task_progress": {
				console.assert(
					message.content,
					"Message content is empty for task progress update",
				);
				await updateGenerationProgress(this._generationId, message.content);
				break;
			}
			case "finished": {
				await completeGeneration(this._generationId, true);
				finishGenerationTask(this._generationId, this._host);
				break;
			}
			case "error": {
				// Handle error
				await completeGeneration(this._generationId, false);
				removeContainerTask(this._generationId);
				break;
			}
			case "abort": {
				// Handle abort
				await completeGeneration(this._generationId, false);
				removeContainerTask(this._generationId);
				break;
			}
		}
	}
}

// FIXME: Move into a separate file and share with codegen gateway or derive type from Eden
type MessageResponseSchema = {
	type: "task_progress" | "finished" | "error" | "abort";
	content: string;
	usage?: {
		totalTokens: number;
		totalCostUsd?: number;
	};
	taskId?: string;
};


self.addEventListener("message", (event) => {
	if (event.data && event.data.type === generationEvents.GENERATION_START) {
		const { generationId, planId, host } = event.data.payload;
		const task = new GenerationTask(generationId, planId, host);
		task.start();
	}
});
