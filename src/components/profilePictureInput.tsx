"use client"

import {useState} from "react";
import {cn} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Session} from "next-auth";

const ProfilePictureInput = ({session}: { session: Session }) => {
    const [avatar, setAvatar] = useState<string | null>(session?.user.image as string | null);


    async function handleEditProfilePicture() {

        const file = await new Promise<File>((resolve) => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/jpeg, image/png, image/gif, image/webp, image/bmp, image/tiff, image/svg+xml';
                input.onchange = () => {
                    resolve(input.files![0]);
                };
                input.click();
            }
        );
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/private/upload/pp', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (response.ok) setAvatar(data.fileObject.cdn);

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