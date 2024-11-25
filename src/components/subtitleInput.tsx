import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {cn} from "@/lib/utils";

export default function SubtitleInput({labelText, placeholderText, type, name, subText}: {labelText: string, placeholderText: string, type: string, name: string, subText: string}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={name}>{labelText}</Label>
            <Input placeholder={placeholderText} type={type} name={name} className={cn(`max-w-sm`)} />
            <p className="mt-2 text-xs text-muted-foreground" role="region" aria-live="polite">
                {subText}
            </p>
        </div>
    );
}
