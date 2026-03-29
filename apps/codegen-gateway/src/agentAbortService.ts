import type { Service, ServiceResponse, State } from "./types";

export const agentAbortService = async function* (
	_message: string,
	state: State,
): Service {
	state.agent.abort();
	return;
};
