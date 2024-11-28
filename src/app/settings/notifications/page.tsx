import {BreadcrumbPortal} from "@/components/breadcrumbBar";
import React from "react";
import H1 from "@/components/ui/h1";
import {cn} from "@/lib/utils";
import {SettingsSecondaryNav} from "@/components/secondaryNavs";

const NewTourPage = async () => {
    // const session = await getServerSession(authOptions);
    // // const [username, setUsername] = useState(session?.user?.name as string);
    // const [user] = await Promise.all([
    //     db.user.findUnique({
    //         where: {id: session?.user?.id},
    //         include: {
    //             sessions: true,
    //         }
    //     }),
    // ])


    return (
        <>
            <BreadcrumbPortal items={
                [
                    {
                        title: 'Settings', url: '/settings'
                    },
                    {
                        title: 'Sessions', url: '/settings/sessions'
                    }
                ]
            }/>
            <SettingsSecondaryNav activeTab={'Sessions'}/>
            <div className="flex flex-1 flex-col gap-4 p-4 lg:max-w-screen-lg max-w-lg w-full mx-auto ">
                <div className={cn(`flex flex-col gap-2 w-full`)}>
                    <H1>Notifications</H1>

                </div>
            </div>
        </>
    )
}

export default NewTourPage