import {BreadcrumbPortal} from "@/components/breadcrumbBar";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import ProfileSettingsPage from "@/components/profileSettingsPage";

const ProfileSettings = async () => {
    const session = await getServerSession(authOptions)



    return (
        <>
            <BreadcrumbPortal items={
                [
                    {
                        title: 'Settings', url: '/settings'
                    },
                    {
                        title: 'Account', url: '/settings/account'
                    }
                ]
            }/>
            <ProfileSettingsPage session={session}/>
        </>
    );
}

export default ProfileSettings;