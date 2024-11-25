import {BreadcrumbPortal} from "@/components/breadcrumbBar";
import H1 from "@/components/ui/h1";

const AccountSettings = async () => {
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
            <div className="flex flex-1 flex-col gap-4 p-4">
                <H1
                >Username</H1>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"/>

            </div>
        </>
    );
}

export default AccountSettings;