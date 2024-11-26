"use client"

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React from "react";

interface RadioLabeledProps {
    lable: string;
    sublabel: string;
    description: string;
    value: string;
}

export default function RadioGroupLabeled({items, defaultValue, onClickAction}: { items: RadioLabeledProps[], defaultValue: string, onClickAction: (value: string) => void }) {
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
                            />
                            <div className="grid grow gap-2">
                                <Label htmlFor={'radio-' + item.value}>
                                    {item.lable}{" "}
                                    <span className="text-xs font-normal leading-[inherit] text-muted-foreground">
                                        {item.sublabel}
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
