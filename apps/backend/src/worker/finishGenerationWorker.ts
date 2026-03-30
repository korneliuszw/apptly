import { getApiClient } from "@apptly/gateway-socket/src";
import { generationEvents } from "./tasks/events";
import { createGenerationArtifact } from "../repository/generationRepository";
import { removeContainerTask } from "./tasks/containerTask";

declare var self: Worker;

const finishGeneration = async (generationId: string, host: string) => {
	const api = getApiClient(`http://${host}`);
	const res = await api.artifact.get();
	// TODO: Save the artifact to a storage service and get the URL
	if (!res.data?.path) {
		throw new Error(
			"Failed to get the artifact path from the generation container",
		);
	}
	await createGenerationArtifact(generationId, "code", res.data.path);
	removeContainerTask(generationId);
};

self.addEventListener("message", (event) => {
	if (event.data && event.data.type === generationEvents.GENERATION_SUCCESS) {
		const { generationId, host } = event.data.payload;
		finishGeneration(generationId, host).catch((error) => {
			console.error(`Failed to finish generation ${generationId}:`, error);
		});
	}
});
