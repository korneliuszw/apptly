import { generationEvents, GenerationStartEvent } from "./events";

const worker = new Worker("../startGenerationWorker.ts");

export const startGenerationTask = (
	generationId: string,
	planId: string,
	host: string,
) =>
	worker.postMessage({
		type: generationEvents.GENERATION_START,
		payload: {
			generationId,
			planId,
			host,
		},
	} as GenerationStartEvent);
