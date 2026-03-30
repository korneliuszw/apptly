import { containerEvents, ContainerRemoveEvent } from "./events";

const worker = new Worker("../containerWorker.ts");

export const removeContainerTask = (generationId: string) => {
	worker.postMessage({
		type: containerEvents.CONTAINER_REMOVE,
		payload: {
			generationId,
		},
	} as ContainerRemoveEvent);
};
