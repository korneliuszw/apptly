import { createOpencode } from "@opencode-ai/sdk";
import { AI_API_KEY, AI_BASE_URL, APP_WORKDIR } from "./constants";

const DEFAULT_PROVIDER = "nano-gpt";
const DEFAULT_MODEL = "zai-org/glm-5.1";

export type SessionId = string;

export class Agent {
	private providerName: string;
	private modelName: string;
	private _agentServer: Awaited<ReturnType<typeof createOpencode>>;
	private _abortController: AbortController;
	private constructor(
		agentServer: Awaited<ReturnType<typeof createOpencode>>,
		providerName = DEFAULT_PROVIDER,
		modelName = DEFAULT_MODEL,
		abortController,
	) {
		this._agentServer = agentServer;
		this.providerName = providerName;
		this.modelName = modelName;
		this._abortController = abortController;
	}

    public get baseOptions() {
        return {
            query: { directory: APP_WORKDIR },
        }
    }
	public static async create(
		providerName = DEFAULT_PROVIDER,
		modelName = DEFAULT_MODEL,
	) {
		const abortController = new AbortController();
		const agentServer = await createOpencode({
            // Localhost (and maybe domain names overall?) don't work for some reason, use IP
			hostname: "127.0.0.1",
			port: 2137, // Use an ephemeral port,
			signal: abortController.signal,
			config: {
				model: modelName,
				provider: {
					[providerName]: {
						name: "OpenAI Compatible",
						npm: "@ai-sdk/openai-compatible",
						options: {
							baseURL: AI_BASE_URL,
						},
                        models: {
                            "zai-org/glm-5.1": {
                                name: "GLM 5.1",
                                limit: {
                                    context: 200_000,
                                    output: 60_000,
                                },
                                cost: {
                                    // $1 1Mtokens input, $3 1Mtokens output, these are just rough estimates and may not reflect the actual cost, you should check with your provider for accurate pricing
                                    input: 1,
                                    output: 3
                                }
                            },
                        }
					},
				},
				permission: {
					bash: "deny",
					external_directory: "deny",
					doom_loop: "allow",
					edit: "allow",
					webfetch: "deny",
				},
			},
		});
        await agentServer.client.auth.set({
            path: {id: providerName},
            body: {
                type: "api",
                key: AI_API_KEY,
            }
        })
		return new Agent(agentServer, providerName, modelName, abortController);
	}

	public abort() {
        console.log("Aborting agent...");
		this._abortController.abort();
	}

	public async sendTextPrompt(plan: string) {
        console.log("Creating session with plan:", plan);
        const session = await this._agentServer.client.session.create(this.baseOptions);
        // FIXME: Error handling
        console.log("Session created:", session);
		const result = await this._agentServer.client.session.prompt({
			path: { id: session.data!.id },
			body: {
				model: { providerID: this.providerName, modelID: this.modelName },
				parts: [{ type: "text", text: plan }],
			},
            ...this.baseOptions,
		});
        console.log("Prompt result:", result);
		return result;
	}

	public stream() {
		return this._agentServer.client.event.subscribe(this.baseOptions);
	}
}
