import type { DockerManager } from "../../../../packages/containers/src";
import {
	getApiClient,
	getSocketConnector,
} from "@apptly/gateway-socket/src/index";
import {
	createGeneration,
	getPlanById,
} from "../repository/generationRepository";

const CODEGEN_IMAGE_NAME = "apptly-codegen:latest";
const CODEGEN_CONTAINER_PORT = 3002;

export const startGeneration = async (
	docker: DockerManager,
	planId: string,
) => {
	const containerId = await docker.createContainer(
		CODEGEN_IMAGE_NAME,
		CODEGEN_CONTAINER_PORT,
	);
	try {
		await createGeneration(planId, containerId);
		const host = await docker.getConnectionUrl(containerId, CODEGEN_CONTAINER_PORT);
		console.debug(`Started generation container ${containerId} on host ${host}`);
		if (!host) {
			throw new Error("Failed to get the mapped port for the container");
		}
		// Start the generation task without awaiting it, so that it runs in the background
		// For now we add delay for container to be ready, but ideally we should have a more robust way to check if the container is ready before starting the generation task
		setTimeout(() => generationTask(planId, host), 5000);
	} catch (error) {
		console.error(`Error during generation for container ${containerId}:`);
		await docker.stopContainer(containerId).catch(() => null);
		throw error;
	}
};

export const generationTask = async (planId: string, host: string) => {
	const api = getApiClient(`http://${host}`);
	const plan = await getPlanById(planId);
	const res = await api.init.post();
	console.log(`Sent init request to generation container for plan ${planId}`, res);
	const socket = getSocketConnector(`http://${host}`, planId);
	socket.subscribe((message) =>
		console.log("Received message from generation container:", message),
	);
	socket.on("close", (e) => console.log("WebSocket connection closed", e));
	socket.on("open", () => {
		console.log("WebSocket connection opened");
		socket.send({
			message: {
				command: "generate",
				content: plan[0].plan,
			},
		});
	});
};
