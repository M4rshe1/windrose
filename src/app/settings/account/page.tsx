import {BreadcrumbPortal} from "@/components/breadcrumbBar";
import H1 from "@/components/ui/h1";
import {cn} from "@/lib/utils";
import React from "react";
import H2 from "@/components/ui/h2";
import { auth } from "@/auth"

import db from "@/lib/db";
import UsernameForm from "@/components/usernameForm";
import {redirect} from "next/navigation";
import {User} from "@prisma/client";
import DeleteAccountButton from "@/components/deleteAccountButton";
import AccountProvider from "@/components/accountProvider";
import {SettingsSecondaryNav} from "@/components/secondaryNavs";
import GoToPersonalProfileButton from "@/components/goToPersonalProfileButton";

const AccountSettings = async () => {
    const session = await auth()
    if (!session) return redirect('/auth/login');
    const [user] = await Promise.all([
        db.user.findUnique({
            where: {id: session?.user?.id},
            include: {
                accounts: {
                    select: {
                        id: true,
                        provider: true,
                        token_type: true,
                        access_token: true,
                        scope: true,
                        expires_at: true,
                        session_state: true
                    }
                }
            }
        }),
    ])


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
            <SettingsSecondaryNav activeTab={'Account'}/>
            <div className="flex flex-1 flex-col gap-4 p-4 lg:max-w-screen-lg max-w-lg w-full mx-auto ">
                <div className={cn(`flex flex-col gap-2 w-full`)}>
                    <GoToPersonalProfileButton username={session?.user?.username as string}/>
                    <H1>Account</H1>
                    <UsernameForm user={user as User}/>
                    <H2>OAuth</H2>
                    <div className={'grid lg:grid-cols-2 grid-cols-1 gap-4'}>
                        {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            user?.accounts.map((account) => <AccountProvider item={account} key={account.id}/>)
                        }
                    </div>
                    <H2 className={'text-error'}>Danger Zone</H2>
                    <div
                        className={'border-2 border-error rounded-lg [&>*]:p-4 [&>*]:justify-between [&>*]:flex [&>*]:items-center [&>*]:gap-4'}>
                        <div>
                            <div>
                                <p className={'font-semibold'}>
                                    Delete your account
                                </p>
                                <span className={'text-sm'}>
                                    This action cannot be undone. Please be certain.
                                </span>
                            </div>
                            <DeleteAccountButton user={user as User}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AccountSettings;