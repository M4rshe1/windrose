'use client'

import * as React from "react"
import {Calendar as CalendarIcon} from "lucide-react"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"

interface DateTimeSelectProps {
    onDateTimeChangeAction: (date: Date | null) => void
    defaultValue?: Date,
    className?: string,

    [key: string]: any
}

export function DateTimeSelect({onDateTimeChangeAction, defaultValue, className, ...props}: DateTimeSelectProps) {
    const [date, setDate] = React.useState<Date | undefined>(defaultValue)
    const [selectedHour, setSelectedHour] = React.useState<string>(
        defaultValue ? defaultValue.getHours().toString().padStart(2, '0') : "00"
    )
    const [selectedMinute, setSelectedMinute] = React.useState<string>(
        defaultValue ? defaultValue.getMinutes().toString().padStart(2, '0') : "00"
    )
    const [isOpen, setIsOpen] = React.useState(false)

    const handleDateSelect = (newDate: Date | undefined) => {
        if (newDate) {
            const updatedDate = new Date(newDate)
            updatedDate.setHours(parseInt(selectedHour), parseInt(selectedMinute))
            setDate(updatedDate)
        } else {
            setDate(undefined)
        }
    }

    const handleTimeChange = (type: 'hour' | 'minute', value: string) => {
        if (type === 'hour') setSelectedHour(value)
        if (type === 'minute') setSelectedMinute(value)

        if (date) {
            const updatedDate = new Date(date)
            updatedDate.setHours(
                type === 'hour' ? parseInt(value) : parseInt(selectedHour),
                type === 'minute' ? parseInt(value) : parseInt(selectedMinute)
            )
            setDate(updatedDate)
        }
    }

    const handlePopoverClose = (cancel: boolean) => {
        if (date && !cancel) {
            onDateTimeChangeAction(date)
        } else {
            onDateTimeChangeAction(null)
        }
    }

    return (
        <Popover open={isOpen} onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) {
                handlePopoverClose(false)
            }
        }}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    size={"sm"}
                    className={cn(
                        "justify-start text-left font-normal",
                        className
                    )}
                    {...props}
                >
                    <CalendarIcon className="h-4 w-4"/>
                    {/*{date ? format(date, "PPP HH:mm") : <span>Pick a date and time</span>}*/}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                />
                <div className="flex items-center justify-between p-3 border-t">
                    <Select value={selectedHour} onValueChange={(value) => handleTimeChange('hour', value)}>
                        <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Hour"/>
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({length: 24}, (_, i) => i).map((hour) => (
                                <SelectItem key={hour} value={hour.toString().padStart(2, '0')}>
                                    {hour.toString().padStart(2, '0')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span>&nbsp;:&nbsp;</span>
                    <Select value={selectedMinute} onValueChange={(value) => handleTimeChange('minute', value)}>
                        <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Minute"/>
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({length: 60}, (_, i) => i).map((minute) => (
                                <SelectItem key={minute} value={minute.toString().padStart(2, '0')}>
                                    {minute.toString().padStart(2, '0')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className={'mb-2 mx-2 flex items-center gap-2'}>
                    <Button onClick={() => {
                        setIsOpen(false);
                        handlePopoverClose(true);
                    }} variant="outline" className="w-full">
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        setIsOpen(false);
                        handlePopoverClose(false);
                    }} className="w-full">
                        Done
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
