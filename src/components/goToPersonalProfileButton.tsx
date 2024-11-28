import {cn} from "@/lib/utils";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import React from "react";

const GoToPersonalProfileButton = ({username}:{username: string}) => {
    return (
        <div className={cn('flex items-center justify-end')}>
            <Link href={`/${username}`}>
                <Button variant={`outline`} size={`sm`}
                        className={cn(`bg-base-100 hover:bg-base-200 cursor-pointer`)}
                >Go to your personal profile</Button>
            </Link>
        </div>
    );
}

export default GoToPersonalProfileButton