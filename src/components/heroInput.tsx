"use client"

import {useState} from "react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {uploadPicture} from "@/lib/uploadPicture";
import {deleteTourHeroAction} from "@/actions/deleteTourHeroAction";
import {confirmModal} from "@/components/confirmModal";
import Image from "next/image";

const HeroInput = ({tour, image}: { tour: any, image: string }) => {
    const [hero, setHero] = useState<string | null>(image);

    async function handleEditHeroPicture() {
        const {ok, data} = await uploadPicture("/api/private/upload/hero", { tourId: tour.id });
        if (ok) setHero(data.fileObject.cdn);
    }

    return (
        <div className={cn("")}>
            <div className={cn(`relative w-full mx-auto`)}>
                <div
                    className={cn("rounded-lg overflow-hidden bg-base-300 relative grid place-items-center w-full aspect-video")}>
                    <div className={'col-start-1 row-start-1'}>
                        No Hero Image
                    </div>
                    {
                        hero &&
                        <Image src={hero as string} alt={`Hero`} width={1920} height={1080} className={'col-start-1 row-start-1'}/>
                    }
                    <div className={
                        cn("absolute m-auto text-white font-bold text-4xl bg-black/50 p-2 rounded mx-2")
                    }>
                        {tour.displayName}
                    </div>
                </div>
                <div className={cn(`absolute bottom-4 left-4 flex items-center gap-2`)}>

                    <Button variant={`outline`} size={`sm`}
                            className={cn(`bg-base-100 hover:bg-base-200`)}
                            onClick={handleEditHeroPicture}>Edit</Button>
                    <Button variant={`error`} size={`sm`}
                            onClick={async () => {
                                if (await confirmModal({
                                    title: 'Delete Hero Image',
                                    text: `Are you sure you want to delete the hero image?`,
                                    buttonTrue: "Confirm",
                                    buttonFalse: "Cancel"
                                })) {
                                    setHero(null)
                                    await deleteTourHeroAction(tour.id)
                                }
                            }
                            }>Delete</Button>
                </div>

            </div>
        </div>
    )
}

export default HeroInput;