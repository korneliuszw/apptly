export const generationEvents = {
    GENERATION_SUCCESS: "generation_success",
    GENERATION_START: "generation_start",
} as const

export const containerEvents = {
    CONTAINER_REMOVE: "container_remove",
} as const

export interface GenerationSuccessEvent {
    type: typeof generationEvents.GENERATION_SUCCESS;
    payload: {
        generationId: string;
        host: string
    }
}

export interface ContainerRemoveEvent {
    type: typeof containerEvents.CONTAINER_REMOVE;
    payload: {
        generationId: string;
    }
}

export interface GenerationStartEvent {
    type: typeof generationEvents.GENERATION_START;
    payload: {
        generationId: string;
        planId: string;
        host: string
    }
}