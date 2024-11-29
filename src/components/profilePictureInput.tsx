"use client"

import {useState} from "react";
import {cn} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Session} from "next-auth";
import {uploadPicture} from "@/lib/uploadPicture";

const ProfilePictureInput = ({session}: { session: Session }) => {
    const [avatar, setAvatar] = useState<string | null>(session?.user.image as string | null);


    async function handleEditProfilePicture() {
        const {ok, data} = await uploadPicture("/api/private/upload/pp");
        if (ok) setAvatar(data.fileObject.cdn);
    }

    return (
        <div className={cn("")}>
            <Label>Profile Picture</Label>
            <div className={cn(`relative w-[300px] h-[300px] mx-auto`)}>
                <div
                    className={cn("rounded-full overflow-hidden bg-base-300 w-[300px] h-[300px] relative border-2 border-neutral grid place-items-center")}>
                    <Avatar className="w-[300px] h-[300px]">
                        <AvatarImage src={avatar as string} alt={session?.user.name as string}/>
                        <AvatarFallback className="rounded-lg text-9xl">
                            {
                                session?.user?.name?.split(' ').map((name: string) => name[0].toUpperCase()).join('')
                            }
                        </AvatarFallback>
                    </Avatar>
                </div>
                <Button variant={`outline`} size={`sm`}
                        className={cn(`absolute bottom-8 left-8 bg-base-100 hover:bg-base-200`)}
                        onClick={handleEditProfilePicture}>Edit</Button>
            </div>
        </div>
    )
}

export default ProfilePictureInput;