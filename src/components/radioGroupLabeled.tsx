"use client"

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React from "react";

interface RadioLabeledProps {
    label: string;
    subLabel?: string;
    description?: string;
    value: string;
}

export default function RadioGroupLabeled({items, defaultValue, onClickAction, ...props}: { items: RadioLabeledProps[], defaultValue: string, onClickAction: (value: string) => void, [key: string]: unknown }) {
    return (
        <RadioGroup className="gap-6" defaultValue={defaultValue}>
            {
                items.map((item: RadioLabeledProps, index: number) => {
                    return (
                        <div className="flex items-start gap-2" key={index}>
                            <RadioGroupItem
                                value={item.value}
                                id={'radio-' + item.value}
                                aria-describedby={item.description}
                                onClick={() => onClickAction(item.value)}
                                {...props}
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
