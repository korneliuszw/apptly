import { createBrowserRouter } from "react-router";
import AuthPage from "./features/auth/pages/auth-page";
import { LandingPage } from "./features/landing/pages/landing-page";
import { AuthGuard } from "./features/auth/auth-provider";
import { MainLayout } from "./main-layout";
import { ApplicationSelectPage } from "./features/applications/application-select-page";
export const router = createBrowserRouter([
	{
		Component: LandingPage,
		index: true,
	},
	{
		path: "/",
		Component: AuthGuard,
		children: [
			{
				path: "auth/:pathname",
				Component: AuthPage,
			},
			{
				path: "/app",
                Component: MainLayout,
                children: [
                    {
                        index: true,
                        Component: ApplicationSelectPage
                    }
                ]
			},
		],
	},
]);
