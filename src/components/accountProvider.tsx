'use client'

import {cn} from "@/lib/utils";
import {IconBrandGithub, IconBrandGoogle} from "@tabler/icons-react";
import {Button} from "@/components/ui/button";
import {Trash} from "lucide-react";
import {confirmModal} from "@/components/confirmModal";
import {removeAccountProvider} from "@/actions/removeAccountProvider";

const AccountProvider = ({item}: { item: { provider: string, type: string, scope: string, expires_at: string, session_state: string } }) => {

    async function handleRemove() {
        if (await confirmModal({
            title: 'Remove account provider',
            text: 'Are you sure you want to remove this account provider?',
            buttonFalse: 'Cancel',
            buttonTrue: 'Remove',
            confirmValue: item.provider
        })) {
            await removeAccountProvider(item.provider)
        }
    }

    return (
        <div className={cn('flex flex-col gap-4 rounded-lg border-2 border-neutral p-4')}>
            <div className={cn('flex items-center justify-between')}>
                <div className={cn('flex items-center gap-2')}>
                    {item.provider === 'google' && <IconBrandGoogle/>}
                    {item.provider === 'github' && <IconBrandGithub/>}
                    <p className={cn('text-lg font-semibold')}>
                        {
                            item.provider.charAt(0).toUpperCase() + item.provider.slice(1)
                        }
                    </p>
                </div>
                <Button
                    variant={'error'}
                    onClick={handleRemove}
                >
                    <Trash/>
                </Button>
            </div>
            <div className={cn('grid grid-cols-2 gap-2')}>
                <div>
                    <p className={cn("text-xs font-semibold")}>Expires at</p>
                    <p>{
                        new Date(item.expires_at).toLocaleString()
                    }</p>
                </div>
                <div>
                    <p className={cn("text-xs font-semibold")}>Scope</p>
                    <p>{item.scope || 'No scope defined'}</p>
                </div>
                <div>
                    <p className={cn("text-xs font-semibold")}>Type</p>
                    <p>{item.type || 'No type defined'}</p>
                </div>
                <div>
                    <p className={cn("text-xs font-semibold")}>Session state</p>
                    <p>{item.session_state || 'No session state defined'}</p>
                </div>
            </div>
        </div>
    );
}

export default AccountProvider;