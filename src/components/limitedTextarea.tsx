"use client";

import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {useCharacterLimit} from "@/hooks/use-character-limit";

export default function LimitedTextarea({maxLength, title, initialValue, onBlurAction, ...props}: {
    maxLength: number,
    title: string,
    initialValue: string,
    onBlurAction: (value: string) => void,
    [key: string]: unknown
}) {
    const {
        value,
        characterCount,
        handleChange,
        maxLength: limit,
    } = useCharacterLimit({maxLength, initialValue});

    return (
        <div className="space-y-2">
            <Label htmlFor="textarea-16">{title}</Label>
            <Textarea
                id="textarea-16"
                value={value}
                maxLength={maxLength}
                onChange={handleChange}
                onBlur={() => onBlurAction(value)}
                aria-describedby="characters-left-textarea"
                {...props}
            />
            <p
                id="characters-left-textarea"
                className="mt-2 text-right text-xs text-muted-foreground"
                role="status"
                aria-live="polite"
            >
                <span className="tabular-nums">{limit - characterCount} of {limit}</span> characters left
            </p>
        </div>
    );
}
