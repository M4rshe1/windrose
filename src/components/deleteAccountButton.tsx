"use client"

import {Button} from "@/components/ui/button";
import React from "react";
import {confirmModal} from "@/components/confirmModal";
import {User} from "@prisma/client";

const DeleteAccountButton = ({user}:{user: User}) => {
    const deleteAccount = async () => {
        if (await confirmModal(
            {
                title: 'Delete Account',
                text: 'Are you sure you want to delete your account?',
                buttonTrue: 'Delete',
                buttonFalse: 'Cancel',
                confirmValue: user.username ? user.username : user.email
            }
        )) {

        }
    }

    return (
        <Button className={"bg-error text-error-content hover:bg-error/80 lg:max-w-48 max-w-full w-full"}
                onClick={deleteAccount}>Delete Account</Button>
    )
}

export default DeleteAccountButton