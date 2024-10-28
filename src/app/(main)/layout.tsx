import { ChevronsUpDown, Search } from "lucide-react"
import Logo from '../../../public/Logo.svg'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import Image from "next/image";
import { getKindeServerSession, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { ScrollArea } from "@/components/ui/scroll-area";

const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            items: [],
        },
        {
            title: "Task Management",
            url: "/task-management",
            items: [
                {
                    title: "View All Tasks",
                    url: "/tasks",
                },
                {
                    title: "My Tasks",
                    url: "/mytasks",
                },
            ],
        },
        {
            title: "Settings",
            url: "/settings",
            items: [
                {
                    title: "User Profile",
                    url: "/profile",
                },
            ],
        },
    ],
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { getUser } = await getKindeServerSession();
    const user = await getUser();
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size="lg"
                                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                    >
                                        <Image src={Logo} alt="BugTracker" width={45} />
                                        <div className="flex flex-col gap-0.5 leading-none">
                                            <span className="font-semibold">Bug Tracker</span>
                                            <span className="">{user.email}</span>
                                        </div>
                                        <ChevronsUpDown className="ml-auto" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-[--radix-dropdown-menu-trigger-width]"
                                    align="start"
                                >
                                    <DropdownMenuItem>
                                        <LogoutLink className="w-full">Log out</LogoutLink>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                    <form>
                        <SidebarGroup className="py-0">
                            <SidebarGroupContent className="relative">
                                <Label htmlFor="search" className="sr-only">
                                    Search
                                </Label>
                                <SidebarInput
                                    id="search"
                                    placeholder="Search tasks..."
                                    className="pl-8"
                                />
                                <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </form>
                </SidebarHeader>
                <SidebarContent>
                    {/* We create a SidebarGroup for each main navigation section */}
                    {data.navMain.map((item) => (
                        <SidebarGroup key={item.title}>
                            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {item.items.length === 0 ? (
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild>
                                                <a href={item.url}>{item.title}</a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ) : (
                                        item.items.map((subItem) => (
                                            <SidebarMenuItem key={subItem.title}>
                                                <SidebarMenuButton asChild>
                                                    <a href={subItem.url}>{subItem.title}</a>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))
                                    )}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))}
                </SidebarContent>
                <SidebarRail />
            </Sidebar>
            <SidebarInset>
                <SidebarTrigger className="absolute top-[30%] z-10" />
                <div className="flex flex-1 flex-col gap-4 m-3 border rounded-md bg-card">
                    <ScrollArea className="h-[calc(100vh-1.5rem)]">
                        {children}
                    </ScrollArea>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}