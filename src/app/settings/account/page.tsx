import {BreadcrumbPortal} from "@/components/breadcrumbBar";
import H1 from "@/components/ui/h1";
import {cn} from "@/lib/utils";
import React from "react";
import H2 from "@/components/ui/h2";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import db from "@/lib/db";
import UsernameForm from "@/components/usernameForm";
import {redirect} from "next/navigation";
import {User} from "@prisma/client";
import DeleteAccountButton from "@/components/deleteAccountButton";
import AccountProvider from "@/components/accountProvider";

const AccountSettings = async () => {
    const session = await getServerSession(authOptions);
    if (!session) return redirect('/auth/login');
    const [user] = await Promise.all([
        db.user.findUnique({
            where: {id: session?.user?.id},
            include: {
                accounts: {
                    select: {
                        id: true,
                        provider: true,
                        type: true,
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
            <div className="flex flex-1 flex-col gap-4 p-4 lg:max-w-screen-lg max-w-lg w-full mx-auto ">
                <div className={cn(`flex flex-col gap-2 w-full`)}>
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
                    <DeleteAccountButton user={user as User}/>

                </div>
            </div>
        </>
    );
}

export default AccountSettings;