import { treaty } from "@elysiajs/eden";
import { App } from "@apptly/codegen/src";

export const getSocketConnector = (url: string, connectionId: string) => {
	const api = treaty<App>(url);
	return api.ws.subscribe({ query: { id: connectionId } });
};

export const getApiClient = (url: string) => {
	const api = treaty<App>(url);
	return api;
};
