import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {TablerIcon} from "@tabler/icons-react";
import {LucideIcon} from "lucide-react";
import {cn} from "@/lib/utils";

export default function SelectWithIcons({options, label, name, ...props}: {
    options: { label: string, value: string, icon: TablerIcon | LucideIcon }[],
    label?: string,
    name: string,
    [key: string]: unknown
}) {
    return (
        <div className="space-y-2">
            {
                label && <Label htmlFor="select-35">
                    {label}
                </Label>
            }
            <Select
            name={name}
            >
                <SelectTrigger
                    id="select-35"
                    className={cn("[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0", props.className || '')}
                    {...props}
                >
                    <SelectValue placeholder="Select a Social"
                    />
                </SelectTrigger>
                <SelectContent
                    className="[&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
                    {options.map((option, index) => (
                        <SelectItem key={index} value={option.value}>
                            <div className={cn('flex items-center whitespace-nowrap gap-1')}>
                                <option.icon size={24} strokeWidth={2} aria-hidden="true"/>
                                <span className="truncate">{option.label}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}


