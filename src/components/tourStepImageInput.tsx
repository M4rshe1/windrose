"use client"
import {useEffect, useState} from "react";
import {uploadPicture} from "@/lib/uploadPicture";
import {File} from "@prisma/client";
import {DataTable} from "@/components/data-table";
import {columns} from "@/components/tourSectionImagesTable/columns";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";

const TourStepImageInput = ({images, deleteImage, maxImages, sectionId, reval}: {
    images: File[],
    deleteImage: (fileId: string) => void,
    maxImages: number
    sectionId: string
    reval: string
}) => {
    const [files, setFiles] = useState<File[]>(images)

    async function handleAddImage() {
        const {ok, data} = await uploadPicture("/api/private/upload/step", {sectionId: sectionId});
        if (ok)
            setFiles([...files, data.fileObject.file])
    }

    useEffect(() => {
        setFiles(images)
    }, [images]);


    return (
        <div
            className={cn(`w-full flex flex-col gap-2`)}>
            <div className={cn(`flex gap-2 justify-end`)}>
                <Button variant={`default`} size={`sm`}
                    onClick={handleAddImage}
                    disabled={files.length >= maxImages}
                >
                    Add Image
                </Button>
            </div>
            <DataTable columns={columns} data={
                files.map((file: File) => ({
                    fileKey: file.fileKey,
                    file: file,
                    filename: file.fileName,
                    id: file.id,
                    reval: reval
                }))
            }
            />
        </div>
    )
}

export default TourStepImageInput