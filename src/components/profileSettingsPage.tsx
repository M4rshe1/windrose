"use client"
import H1 from "@/components/ui/h1";
import {cn} from "@/lib/utils";
import SubtitleInput from "@/components/subtitleInput";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

const ProfileSettingsPage = ({session}: Readonly<{ session: any }>) => {
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
        <div className="flex flex-1 flex-col gap-4 p-4">
            <H1
            >Public Profile</H1>
            <div className={cn(`mx-auto`)}>
                <div className={cn(`grid md:grid-cols-[1fr_auto] grid-cols-1 gap-8`)}>
                    <div>

                        <SubtitleInput labelText={`Name`} placeholderText={``} type={`text`} name={`name`}
                                       subText={`This is the name that will be displayed on your profile. You can remove it at any time.`}/>
                    </div>
                    <div className={cn(`relative`)}>
                        <Label>Profile Picture</Label>
                        <div className="rounded-full overflow-hidden bg-base-300w-[300px] aspect-square border-2 border-neutral grid place-items-center">
                            <Avatar className="w-[300px] h-[300px]">
                                <AvatarImage src={avatar as string} alt={session?.user.name}/>
                                <AvatarFallback className="rounded-lg text-9xl">
                                    {
                                        session?.user.name.split(' ').map((name: string) => name[0].toUpperCase()).join('')
                                    }
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <Button variant={`outline`} size={`sm`}
                                className={cn(`absolute bottom-8 left-8 bg-base-100 hover:bg-base-200`)}
                                onClick={handleEditProfilePicture}>Edit</Button>
                    </div>
                </div>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"/>
            </div>
        </div>
    );
}

export default ProfileSettingsPage;