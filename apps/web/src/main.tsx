import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./router";
import { Toaster } from "./components/ui/sonner";

// import App from './app/app';

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);

root.render(
	<StrictMode>
		<RouterProvider router={router} />
		<Toaster/>
	</StrictMode>,
);
