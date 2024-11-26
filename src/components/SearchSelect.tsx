"use client";

import {Label} from "@/components/ui/label";
import {Check, ChevronDown, LucideIcon} from "lucide-react";
import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {TablerIcon} from "@tabler/icons-react";
import PulsatingCircle from "@/components/PulsatingCircle";


export default function SearchSelect(
    {options, label, onChangeAction, defaultValue}: {
        options: {
            label: string,
            value: string,
            icon?: TablerIcon | LucideIcon,
            flag?: React.ReactNode,
            color?: string
        }[],
        label?: string,
        name: string,
        defaultValue?: string,
        onChangeAction: (value: string) => void,
    }
) {
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>(defaultValue || "");

    useEffect(() => {
        console.log(value);
    }, [value]);

    return (
        <div className="space-y-2">
            {
                label && <Label htmlFor="select-41">
                    {label}
                </Label>
            }
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="select-41"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between px-3 border-2 border-neutral hover:bg-transparent font-normal outline-offset-0 focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20"
                    >
            <span className={cn("truncate flex items-center justify-between w-full")}>
                <div>

              {value
                  ? (
                      <>
                          {options.find((option) => option.label === value)?.icon ? options.find((option) => option.label === value)?.icon : options.find((option) => option.label === value)?.flag}
                          {options.find((option) => option.label === value)?.label}
                      </>
                  )
                  : `Select ${label} `}
                </div>
                {
                    value && options.find((option) => option.label === value)?.color &&
                    <PulsatingCircle color={options.find((option) => option.label === value)?.color}/>
                }
            </span>
                        <ChevronDown
                            size={16}
                            strokeWidth={2}
                            className="shrink-0"
                            aria-hidden="true"
                        />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-full min-w-[var(--radix-popper-anchor-width)] p-0 border-2 input-bordered border-neutral bg-base-300 shadow-lg"
                    align="start"
                >
                    <Command>
                        <CommandInput placeholder={`Search ${label}...`}/>
                        <CommandList>
                            <CommandEmpty>No {label} found.</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label}
                                        onSelect={(selectedValue) => {
                                            const code = options.find((option) => option.label === selectedValue)?.value || "";
                                            setValue(selectedValue === value ? "" : selectedValue);
                                            setOpen(false);
                                            onChangeAction(code);
                                        }}
                                        className={cn('flex items-center w-full justify-between')}
                                    >
                                        <div>

                                            {
                                                option.icon ? <option.icon size={24} strokeWidth={2}
                                                                           aria-hidden="true"/> : option.flag
                                            }
                                            {option.label}
                                        </div>
                                        <div className={cn("flex items-center gap-2")}>

                                            <Check
                                                className={cn(
                                                    "ml-auto",
                                                    value === option.value ? "opacity-100" : "opacity-0",
                                                )}
                                            />
                                            {
                                                option.color &&
                                                <PulsatingCircle color={option.color}/>
                                            }
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
