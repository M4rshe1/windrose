import Head from "next/head";
import {BreadcrumbPortal} from "@/components/breadcrumbBar";

const AppearanceSettings = async () => {
    return (
        <>
            <Head>
                <title>Appearance</title>
            </Head>
            <BreadcrumbPortal items={
                [
                    {
                        title: 'Settings', url: '/settings'
                    },
                    {
                        title: 'Appearance', url: '/settings/appearance'
                    }
                ]
            }/>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <h1></h1>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"/>
            </div>
        </>
    );
}

export default AppearanceSettings;