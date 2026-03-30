import { RiApps2Line, RiArrowUpBoxFill, RiCheckLine } from "@remixicon/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { useApplications } from "../../hooks/useApplications";
import { useApplicationStore } from "../../store/application";
import { UserButton } from "@daveyplate/better-auth-ui";

export const ApplicationSwitcher = () => {
	const { applications } = useApplications();
    const {setSelectedApplicationId, selectedApplicationId} = useApplicationStore()
    const selectedApplicationName = applications.find(app => app.id === selectedApplicationId)
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
								<RiApps2Line className="size-4" />
							</div>
							<div className="flex flex-col gap-0.5 leading-none">
								<span className="font-medium">{selectedApplicationName?.name || "Select Application"}</span>
							</div>
							<RiArrowUpBoxFill className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width)"
						align="start"
					>
						{applications.map((app) => (
							<DropdownMenuItem
								key={app.id}
								onSelect={() => setSelectedApplicationId(app.id)}
							>
								{app.name}{" "}
								{app.id === selectedApplicationId && <RiCheckLine className="ml-auto" />}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
};
