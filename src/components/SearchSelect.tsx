"use client";

import {Label} from "@/components/ui/label";
import {Check, ChevronDown, LucideIcon} from "lucide-react";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {TablerIcon} from "@tabler/icons-react";
import PulsatingCircle from "@/components/PulsatingCircle";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";


export default function SearchSelect(
    {options, label, onChangeAction, defaultValue, className, placeholder}: {
        options: {
            label: string,
            value: string,
            icon?: TablerIcon | LucideIcon,
            flag?: React.ReactNode,
            color?: string
            image?: string
        }[],
        label?: string,
        placeholder?: string,
        name: string,
        className?: string,
        defaultValue?: string,
        onChangeAction: (value: string) => void,
    }
) {
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>(defaultValue || "");


    return (
        <div className="space-y-2">
            {
                label && <Label htmlFor={"select-41-" + label}>
                    {label}
                </Label>
            }
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={"select-41-" + label}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn("justify-between px-3 border-2 border-neutral hover:bg-transparent font-normal outline-offset-0 focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20", className)}>
                        <span className={cn("truncate flex items-center justify-between w-full")}>
                            <div className={cn('flex items-center gap-2')}>

                          {value.length > 0
                              ? (
                                  <>
                                      {
                                          options.find((option) => option.label === value)?.icon
                                              ? options.find((option) => option.label === value)?.icon
                                              : options.find((option) => option.label === value)?.flag
                                                  ? options.find((option) => option.label === value)?.flag
                                                  : options.find((option) => option.label === value)?.image
                                                      ? <Avatar className="h-6 w-6">
                                                          <AvatarImage
                                                              src={options.find((option) => option.label === value)?.image}
                                                              alt={value}/>
                                                          <AvatarFallback className="rounded-lg">
                                                              {value.split(' ').map((name: string) => name[0].toUpperCase()).join('')}
                                                          </AvatarFallback>
                                                      </Avatar>
                                                      : null
                                      }
                                      {options.find((option) => option.label === value)?.label}
                                  </>
                              )
                              : `Select ${placeholder ?? label} `}
                            </div>

                        </span>
                        <ChevronDown
                            size={16}
                            strokeWidth={2}
                            className="shrink-0"
                            aria-hidden="true"
                        />
                        {
                            value && options.find((option) => option.label === value)?.color &&
                            <PulsatingCircle
                                style={{background: options.find((option) => option.label === value)?.color}}/>
                        }
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
                                            setValue(selectedValue);
                                            setOpen(false);
                                            onChangeAction(option.value);
                                        }}
                                        className={cn('flex items-center w-full justify-between')}
                                    >
                                        <div className={cn('flex items-center gap-2')}>

                                            {
                                                option.icon ? <option.icon size={24} strokeWidth={2}
                                                                           aria-hidden="true"/> : option.flag ? option.flag : option.image ?
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={option.image} alt={option.label}/>
                                                        <AvatarFallback className="rounded-lg">
                                                            {option.label.split(' ').map((name: string) => name[0].toUpperCase()).join('')}
                                                        </AvatarFallback>
                                                    </Avatar> : null
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
                                                <PulsatingCircle style={{background: option.color}}/>
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
