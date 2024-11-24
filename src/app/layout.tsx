import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
import ThemeProvider from "@/lib/themeProvider";
import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import {IconBrandSafari} from "@tabler/icons-react";
import Link from "next/link";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Windrose",
    description: "A platform to share your explorations.",
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);
    const authenticated = !!session?.user;
    return (
        <ThemeProvider>
            <body
                className={`${inter.className}`}
            >
            <SidebarProvider>
                {authenticated ?
                    <AppSidebar session={session}/>
                    : <div data-varieant="inset" className="hidden"/>

                }
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 border-neutral">
                        {
                            authenticated &&
                                <SidebarTrigger className="-ml-1"/>
                        }
                        <Separator orientation="vertical" className="mr-2 h-4"/>
                        <Link href={"/"} className="flex items-center gap-2">
                            <IconBrandSafari/>
                        </Link>
                        <div id={"breadcrumb-bar"} className="flex-1"/>
                    </header>
                    {children}
                </SidebarInset>
            </SidebarProvider>

            </body>
        </ThemeProvider>
    );
}
