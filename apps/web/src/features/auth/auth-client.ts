import { createAuthClient } from "better-auth/react";

console.debug("BETTER_AUTH_URL", import.meta.env);

export const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_BETTER_AUTH_URL!,
	basePath: "/auth/api"
});

export const useSession = authClient.useSession;

export type Session = typeof authClient.$Infer.Session