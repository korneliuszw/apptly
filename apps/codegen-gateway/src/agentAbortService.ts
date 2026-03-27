import type { Service, ServiceResponse, State } from "./types"

export const agentAbortService = async function* (_message: string, state: State): Service {
    for (const [id, abortController] of state.agents.entries()) {
        abortController.abort();
        state.agents.delete(id);
        yield {
            type: "abort",
            content: `Aborted agent with ID: ${id}`,
        } as ServiceResponse
    }
    return 
}