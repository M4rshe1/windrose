"use client";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

export default function SubtitleInput({labelText, subText, onBlurAction, className, ...props}: {
    labelText?: string,
    subText?: string,
    className?: string,
    onBlurAction: (value: string) => void,
    [key: string]: unknown
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={props?.id as string}>{labelText}</Label>
            <Input onBlur={
                (event) => {
                    onBlurAction(event.target.value);
                }
            }
                   className={className}
                   {...props}/>
            {
                subText && <p className="mt-2 text-xs text-muted-foreground" role="region" aria-live="polite">
                    {subText}
                </p>
            }
        </div>
    );
}
