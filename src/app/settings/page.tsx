import {BreadcrumbPortal} from "@/components/breadcrumbBar";
import React from "react";
import H1 from "@/components/ui/h1";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {BellDot, CreditCard, Pen, ShieldPlus, User, UserPen} from "lucide-react";

const SettingsPage = async () => {
    const settings = [
        {
            title: 'Appearance', url: '/settings/appearance',
            description: 'Change the look and feel of the app, themes and colors',
            icon: Pen
        },
        {
            title: 'Sessions', url: '/settings/sessions', description: 'Manage your active sessions',
            icon: ShieldPlus
        },
        {
            title: 'Account', url: '/settings/account',
            description: 'Manage your account settings, username, and OAuth providers',
            icon: User
        },
        {
            title: 'Profile', url: '/settings/profile',
            description: 'Manage your Public Profile, Bio, Socials and Avatar',
            icon: UserPen
        },
        {
            title: 'Notifications', url: '/settings/notifications',
            description: 'Manage your notification settings, email and push notifications',
            icon: BellDot
        },
        {
            title: 'Billing', url: '/settings/billing',
            description: 'Manage your billing settings, subscription and payment methods',
            icon: CreditCard
        }
    ]


    return (
        <>
            <BreadcrumbPortal items={
                [
                    {
                        title: 'Settings', url: '/settings'
                    }
                ]
            }/>
            <div className="flex flex-1 flex-col gap-4 p-4 lg:max-w-screen-lg max-w-lg w-full mx-auto ">
                <div className={cn(`flex flex-col gap-2 w-full`)}>
                    <H1>Settings</H1>
                    <div className={'grid lg:grid-cols-2 grid-cols-1 gap-4'}>
                        {
                            settings.map((setting) => (
                                <Link href={setting.url} key={setting.title}
                                      className={cn('border-2 border-neutral rounded-lg hover:shadow-md hover:border-primary transition duration-200 ease-in-out')}>
                                    <div className={cn('flex flex-col gap-2 p-4')}>
                                        <setting.icon/>
                                        <p className={cn('text-lg font-semibold')}>{setting.title}</p>
                                        <p className={cn('text-sm whitespace-break-spaces')}>{setting.description}</p>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default SettingsPage