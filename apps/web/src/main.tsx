import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Providers } from "./providers";

// import App from './app/app';

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);

root.render(
	<StrictMode>
		<BrowserRouter>
			<Providers>
				<div className="p-2"> test</div>
			</Providers>
		</BrowserRouter>
	</StrictMode>,
);
