import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
import ThemeProvider from "@/lib/themeProvider";
import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {getServerSession, Session} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import {IconBrandSafari} from "@tabler/icons-react";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Map, Newspaper} from "lucide-react";
import {HeaderCommand} from "@/components/headerCommand";

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
            <div className={cn('fixed top-0 right-0')} id={'alerts'}></div>
            <SidebarProvider>
                {authenticated ?
                    <AppSidebar session={session}/>
                    : <div data-varieant="inset" className="hidden"/>

                }
                <SidebarInset>
                    <header
                        className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 border-neutral">
                        <div className="flex items-center gap-2">
                            {
                                authenticated &&
                                <SidebarTrigger className="-ml-1"/>
                            }
                            <Separator orientation="vertical" className="mr-2 h-4"/>
                            <Link href={"/"} className="flex items-center gap-2">
                                <IconBrandSafari/>
                            </Link>
                            <div id={"breadcrumb-bar"} className="flex-1"/>
                        </div>
                        <div>
                            <div className={cn('flex items-center justify-end gap-2')}>
                                <HeaderCommand session={session as Session}/>
                                <Link data-tip={'Notifications'} href={`/notifications`}
                                      className={cn('tooltip tooltip-bottom')}>
                                    <Button variant={`outline`} size={`sm`}
                                    >
                                        <Newspaper/>
                                    </Button>
                                </Link>
                                <Link data-tip={'New Tour'} href={`/new`} className={cn('tooltip tooltip-bottom')}>

                                    <Button variant={`default`} size={`sm`}
                                    >
                                        <Map/> New
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </header>
                    {children}
                </SidebarInset>
            </SidebarProvider>
            </body>
        </ThemeProvider>
    );
}
