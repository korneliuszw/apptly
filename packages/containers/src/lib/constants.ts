const CONSTANTS = {
	TEMPLATE_REPOSITORY_URL: process.env.TEMPLATE_REPOSITORY_URL!,
	WORKSPACE_DIR: process.env.WORKSPACE_DIR!,
	AI_API_KEY: process.env.AI_API_KEY!,
	ANTHROPIC_BASE_URL: process.env.ANTHROPIC_BASE_URL!,
	ANTHROPIC_DEFAULT_SONNET_MODEL: process.env.ANTHROPIC_DEFAULT_SONNET_MODEL!,
	ANTHROPIC_DEFAULT_OPUS_MODEL: process.env.ANTHROPIC_DEFAULT_OPUS_MODEL!,
	ANTHROPIC_DEFAULT_HAIKU_MODEL: process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL!,
} as const;

export const mapConstantsToEnv = () =>
	Object.entries(CONSTANTS).reduce((acc, [key, value]) => {
		acc.push(`${key}=${value}`);
		return acc;
	}, [] as string[]);
