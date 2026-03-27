import { agentAbortService } from "./agentAbortService";
import { agentGenerateService } from "./agentGenerateService";
import type { Service } from "./types";



export const serviceFactory = (command: string): Service | null => {
    switch (command) {
        case "generate":
            return agentGenerateService;
        case "abort":
            return agentAbortService;
    }
    return null
}