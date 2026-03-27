import { treaty } from "@elysiajs/eden";
import { App } from "@apptly/codegen/src";

export const getSocketConnector = (url: string) => {
	const api = treaty<App>(url);
	return api.ws.subscribe();
};


export const getApiClient = (url: string) => {
    const api = treaty<App>(url);
    return api;
}