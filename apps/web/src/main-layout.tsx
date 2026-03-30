import { Outlet } from "react-router";
import { AppSidebar } from "./components/sidebar/AppSidebar";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";

export const MainLayout = () => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<main className="container lg:shadow-sm center mx-auto h-full md:my-4 p-4">
					<span className="text-white">test2</span>
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
};
