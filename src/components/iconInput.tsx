import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {LucideIcon} from "lucide-react";
import {TablerIcon} from "@tabler/icons-react";
import {cn} from "@/lib/utils";

export default function IconInput({Icon, label, className, ...props}: {
    Icon: TablerIcon | LucideIcon,
    label?: string,
    className?: string,
    [key: string]: unknown
}) {
    return (
        <div className="space-y-2 w-full">
            {
                label && <Label htmlFor="input-09">
                    {label}
                </Label>
            }
            <div className="relative w-full">
                <Input id="input-09" className={cn("peer ps-9", className)} {...props}/>
                <div
                    className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                    <Icon size={16} strokeWidth={2} aria-hidden="true"/>
                </div>
            </div>
        </div>
    );
}
