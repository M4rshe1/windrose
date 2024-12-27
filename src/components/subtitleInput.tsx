"use client";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useState} from "react";

export default function SubtitleInput({labelText, subText, onBlurAction, className, limit, ...props}: {
    labelText?: string,
    subText?: string,
    className?: string,
    onBlurAction: (value: string) => void,
    limit?: number,
    [key: string]: unknown
}) {
    const [value, setValue] = useState(props?.defaultValue as string || "");
    return (
        <div className="space-y-2">
            <Label htmlFor={props?.id as string}>{labelText}</Label>
            <Input onBlur={
                () => {
                    onBlurAction(value);
                }
            }
                   onChange={(event) => {
                       if (limit && event.target.value.length > limit) {
                           return;
                       }
                       setValue(event.target.value);
                   }}
                   className={className}
                   {...props}/>
            {
                subText &&
                <p className="mt-2 text-xs text-muted-foreground flex justify-between" role="region" aria-live="polite">
                <span>
                    {subText}
                </span>
                    <span>
                    {limit && `${value.length}/${limit}`}
                </span>
                </p>
            }
        </div>
    );
}
