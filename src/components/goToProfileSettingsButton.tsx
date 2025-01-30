import {cn} from "@/lib/utils";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import React from "react";

const GoToProfileSettingsButton = () => {
    return (
        <div className={cn('flex items-center justify-end')}>
            <Link href={`/settings/profile`}>
                <Button variant={`outline`} size={`sm`}
                        className={cn(`bg-base-100 hover:bg-base-200 cursor-pointer`)}
                >Profile Settings</Button>
            </Link>
        </div>
    );
}

export default GoToProfileSettingsButton