import { UserButton } from "@daveyplate/better-auth-ui";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from "../ui/sidebar";
import { ApplicationSwitcher } from "./ApplicationSwitcher";

export const AppSidebar = () => {
	return (
		<Sidebar>
			<SidebarHeader>
				<ApplicationSwitcher />
			</SidebarHeader>
			<SidebarContent>test</SidebarContent>
			<SidebarFooter>
				<UserButton size={"full"} />
			</SidebarFooter>
		</Sidebar>
	);
};
