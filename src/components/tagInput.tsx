"use client";

import {Label} from "@/components/ui/label";
import {Tag, TagInput} from "emblor";
import {useState} from "react";


export default function TagInputComponent({tags, onTagAddAction, onTagRemoveAction}: {
    tags: Tag[],
    onTagAddAction: (tag: Tag) => void,
    onTagRemoveAction: (tag: Tag) => void
}) {
    const [exampleTags, setExampleTags] = useState<Tag[]>(tags);
    const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

    return (
        <div className="space-y-2">
            <Label htmlFor="input-56">Tags</Label>
            <TagInput
                id={"input-56"}
                tags={exampleTags}
                setTags={(newTags) => {
                    const length = newTags.length;
                    if (length > exampleTags.length) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        onTagAddAction(newTags[length - 1]);
                    } else {
                        // find the removed tag
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        const removedTag = exampleTags.find((tag) => !newTags.includes(tag));

                        if (removedTag)
                            onTagRemoveAction(removedTag);
                    }
                    setExampleTags(newTags);
                }}
                placeholder="Add a tag"
                styleClasses={{
                    tagList: {
                        container: "gap-1 flex flex-wrap lg:w-[300px]",
                    },
                    input:
                        "rounded-lg transition-shadow focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[1px] focus-visible:ring-ring/20 border-2 border-neutral placeholder-neutral-400",
                    tag: {
                        body: "relative h-7 border-2 border-neutral rounded-md font-medium text-xs ps-2 pe-7 bg-base-200 hover:bg-base-200 flex-shrink-0",
                        closeButton:
                            "absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-lg flex size-7 transition-colors outline-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 hover:text-error",
                    },
                }}
                activeTagIndex={activeTagIndex}
                setActiveTagIndex={setActiveTagIndex}
                inlineTags={false}
                inputFieldPosition="top"

            />
        </div>
    );
}
