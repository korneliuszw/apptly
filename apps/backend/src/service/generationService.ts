import type { DockerManager } from "../../../../packages/containers/src";
import {
} from "@apptly/gateway-socket/src/index";
import {
	createGeneration,

} from "../repository/generationRepository";
import { startGenerationTask } from "../worker/tasks/generationTask";

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
		const [{ id: generationId }] = await createGeneration(planId, containerId);
		const host = await docker.getConnectionUrl(
			containerId,
			CODEGEN_CONTAINER_PORT,
		);
		console.debug(
			`Started generation container ${containerId} on host ${host}`,
		);
		if (!host) {
			throw new Error("Failed to get the mapped port for the container");
		}
		startGenerationTask(generationId, planId, host);
		return generationId;
	} catch (error) {
		console.error(`Error during generation for container ${containerId}:`);
		await docker.stopContainer(containerId).catch(() => null);
		throw error;
	}
};
