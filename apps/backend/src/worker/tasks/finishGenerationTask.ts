import { generationEvents, GenerationSuccessEvent } from "./events";

const worker = new Worker("../finishGenerationWorker.ts");
export const finishGenerationTask = (generationId: string, host: string) => {
	worker.postMessage({
		type: generationEvents.GENERATION_SUCCESS,
		payload: { generationId, host },
	} as GenerationSuccessEvent);
};
