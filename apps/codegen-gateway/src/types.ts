import {t} from "elysia"

export const knownCommands = ["echo", "generate", "abort", "report"] as const;

export const MessageResponseSchema = t.Object({
    type: t.String({enum: ["task_progress", "finished", "error", "abort"]}),
    content: t.String(),
    usage: t.Optional(t.Object({
        totalTokens: t.Number(),
        totalCostUsd: t.Optional(t.Number())
    })),
    taskId: t.Optional(t.String())
})
export type ServiceResponse = typeof MessageResponseSchema['static']

export type State = {
    agents: Map<string, AbortController>;
}

export type Service = (content: string, state: State) =>  AsyncGenerator<ServiceResponse, void, unknown>