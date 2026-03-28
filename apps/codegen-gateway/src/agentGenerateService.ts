import * as agent from "@anthropic-ai/claude-agent-sdk";
import type { Service, ServiceResponse, State } from "./types";
import { APP_WORKDIR, MAX_BUDGET_USD } from "./constants";




export const agentGenerateService = async function* (
	content: string,
	state: State,
): Service {
	// For demonstration, we simply yield a message. In a real implementation, this would trigger the agent generation process.
	yield `Agent generation initiated with content: ${content}`;
	console.log("Starting agent generation with content:", content);
	const abortController = new AbortController();
	const runningAgent = agent.query({
		prompt: content,
		options: {
			cwd: APP_WORKDIR,
			debug: true,
			model: "zai-org/glm-5.1",
			allowedTools: ["Read", "Write"],
			disallowedTools: ["Execute"],
			permissionMode: "bypassPermissions",
			includePartialMessages: false,
			maxBudgetUsd: MAX_BUDGET_USD,
			settingSources: ["project"],
			// systemPrompt: { type: "preset", preset: "claude_code" },
			// sandbox: {
			// 	enabled: true,
			// },
			tools: { type: "preset", preset: "claude_code" },
			// abortController,
			env: {
				ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY!,
				ANTHROPIC_BASE_URL: process.env.ANTHROPIC_BASE_URL!,
			},
			executable: "bun",
			pathToClaudeCodeExecutable: "/home/bun/.local/bin/claude",
		},
	});
	const id = crypto.randomUUID();
	// state.agents.set(id, abortController);
	console.log(`Started agent with ID ${id}`);
	try {
		for await (const response of runningAgent) {
			console.log("Received response from agent:", response);
			if (response.type !== "system" && response.type !== "result") {
				continue;
			}
			switch (response.subtype) {
				case "task_progress": {
					yield {
						type: "task_progress",
						taskId: response.task_id,
						usage: {
							totalTokens: response.usage.total_tokens,
						},
						content: response.description,
					} as ServiceResponse;
					break;
				}
				case "success": {
					yield {
						type: "finished",
						usage: {
							totalTokens: response.usage.total_tokens,
							totalCostUsd: response.usage.total_cost_usd,
						},
						content: response.result,
					} as ServiceResponse;

					break;
				}
				case "error_during_execution":
				case "error_max_budget_usd":
				case "error_max_structured_output_retries":
				case "error_max_turns": {
					yield {
						type: "error",
						usage: {
							totalTokens: response.usage.total_tokens,
							totalCostUsd: response.usage.total_cost_usd,
						},
						content: response.errors.join("\n"),
					} as ServiceResponse;
					break;
				}
			}
		}
		console.log("Completed agent execution");
	} finally {
		// state.agents.delete(id);
	}
};
