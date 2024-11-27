'use client';

import SubtitleInput from "@/components/subtitleInput";
import React, {ChangeEvent, useState} from "react";
import {Button} from "@/components/ui/button";
import {User} from "@prisma/client";
import {checkUsernameAction} from "@/actions/checkUsernameAction";
import {stringToDashCase} from "@/lib/utils";
import {confirmModal} from "@/components/confirmModal";
import {updateUsernameAction} from "@/actions/updateUsernameAction";

const UsernameForm = ({user}: { user: User }) => {
    const [username, setUsername] = useState(user?.username as string);
    const [usernameInvalid, setUsernameInvalid] = useState(false);

    async function updateUsername() {
        if (await confirmModal({
            title: 'Change Username',
            text: 'Are you sure you want to change your username?',
            buttonTrue: 'Confirm',
            buttonFalse: 'Cancel',
            confirmValue: username
        })) {
            const isValid = await checkUsernameAction(username) && username.length !== 0;
            if (isValid) {
                await updateUsernameAction(username.slice(0, 32));
            } else {
                setUsernameInvalid(true);
            }
        }
    }

    return (
        <div>

            <div className={'flex items-start gap-2'}>
                <SubtitleInput labelText={`Username`} type={`text`} name={`username`} id={`username`}
                               value={username}
                               subText={`This is the name that is in the url of your profile. Max 32 characters`}
                               onBlurAction={async () => setUsernameInvalid(!await checkUsernameAction(username) || username.length === 0)}
                               onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(stringToDashCase(e.target.value))}
                />
                <Button disabled={username === user?.username || usernameInvalid}
                        className={'bg-primary text-primary-foreground hover:bg-primary/8 mt-8'}
                        onClick={updateUsername}>Save</Button>
            </div>
            {
                usernameInvalid &&
                username !== user?.username &&
                <p className={'text-error text-xs'}>Username is already taken or invalid</p>
            }
        </div>
    )
}

export default UsernameForm