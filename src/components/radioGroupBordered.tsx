"use client"
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {cn} from "@/lib/utils";

interface RadioBorderedProps {
    label: string;
    subLabel?: string;
    description?: string;
    value: string;
}

export default function RadioGroupBordered({items, classNameWrapper,defaultValue,onClickAction, ...props}: { items: RadioBorderedProps[], defaultValue?: string,classNameWrapper?: string, onClickAction: (value: string) => void, [key: string]: unknown }) {
    return (
        <RadioGroup className={cn("gap-2", classNameWrapper)} defaultValue={defaultValue}>
            {
                items.map((item: RadioBorderedProps, index: number) => {
                    return (
                        <div className="relative flex w-full items-start gap-2 rounded-lg border-2 border-neutral p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-primary" key={index}>
                            <RadioGroupItem
                                value={item.value}
                                id={'radio-' + item.value}
                                aria-describedby={item.description}
                                className="order-1 after:absolute after:inset-0"
                                {...props}
                                onClick={() => onClickAction(item.value)}
                            />
                            <div className="grid grow gap-2">
                                <Label htmlFor={'radio-' + item.value}>
                                    {item.label}{" "}
                                    <span className="text-xs font-normal leading-[inherit] text-muted-foreground">
                                        {item.subLabel}
                                    </span>
                                </Label>
                                <p id={item.description} className="text-xs text-muted-foreground">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    )
                })
            }
        </RadioGroup>
    );
}
