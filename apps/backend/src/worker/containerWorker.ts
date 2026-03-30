import { DockerManager } from "../../../../packages/containers/src";
import { getGenerationContainerId, markContainerAsDead } from "../repository/generationRepository";
import { containerEvents } from "./tasks/events";

declare var self: Worker;

const docker = new DockerManager();

const killContainer = async (generationId: string) => {
    const containerId = await getGenerationContainerId(generationId);
    if (!containerId) {
        console.error(`No container found for generation ${generationId}`);
        return;
    }
	try {
		await docker.stopContainer(containerId);
        await markContainerAsDead(containerId);
	} catch (error) {
		console.error(`Failed to stop container ${containerId}:`, error);
	}
};

self.addEventListener("message", (event) => {
	if (event.data && event.data.type === containerEvents.CONTAINER_REMOVE) {
		const { generationId } = event.data.payload;
		killContainer(generationId);
	}
});
