"use client"

import {BreadcrumbPortal} from "@/components/breadcrumbBar";
import Head from "next/head";

export default function Page() {

    return (
        <>
            <BreadcrumbPortal items={[
                {title: "Dashboard", url: "/"},
            ]}
            />
            <Head>
                <title>Windrose | Dashboard</title>
            </Head>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="aspect-video rounded-xl bg-base-300"/>
                    <div className="aspect-video rounded-xl bg-base-300"/>
                    <div className="aspect-video rounded-xl bg-base-300"/>
                    <div className="aspect-video rounded-xl bg-base-300"/>
                    <div className="aspect-video rounded-xl bg-base-300"/>
                    <div className="aspect-video rounded-xl bg-base-300"/>
                    <div className="aspect-video rounded-xl bg-base-300"/>
                    <div className="aspect-video rounded-xl bg-base-300"/>
                    <div className="aspect-video rounded-xl bg-base-300"/>
                </div>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"/>
            </div>
        </>
    )
}