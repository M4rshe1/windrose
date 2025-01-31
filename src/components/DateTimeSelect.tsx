'use client'

import * as React from "react"
import {useState} from "react"
import {Calendar as CalendarIcon, MoonStar} from "lucide-react"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Input} from "@/components/ui/input";

interface DateTimeSelectProps {
    onDateTimeChangeAction: (date: Date | null, nights?: number) => void,
    defaultValueDate?: Date,
    className?: string,
    defaultValueNights?: number
    [key: string]: unknown
}

export function DateTimeSelect({
                                   onDateTimeChangeAction,
                                   defaultValueDate,
                                   defaultValueNights,
                                   className,
                                   ...props
                               }: DateTimeSelectProps) {
    const [date, setDate] = useState<Date | undefined>(defaultValueDate)
    const [nights, setNights] = useState<number>(defaultValueNights || 0)
    const [selectedHour, setSelectedHour] = useState<string>(
        defaultValueDate ? defaultValueDate.getHours().toString().padStart(2, '0') : "00"
    )
    const [isOpened, setIsOpened] = useState(false)
    const [selectedMinute, setSelectedMinute] = useState<string>(
        defaultValueDate ? defaultValueDate.getMinutes().toString().padStart(2, '0') : "00"
    )

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

    const handlePopoverClose = () => {
        if (date) {
            onDateTimeChangeAction(date, nights)
            return
        }

        if (defaultValueDate && nights >= 0) {
            onDateTimeChangeAction(defaultValueDate, nights)
        }
    }

    return (
        <Popover open={isOpened}>
            <PopoverTrigger asChild>
                <Button variant="outline" size={'sm'} className={cn('flex items-center gap-2', className)} {...props}
                        onClick={() => setIsOpened(!isOpened)}
                >
                    <CalendarIcon/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-base-100">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    weekStartsOn={1}
                />
                <div className="flex items-center justify-between p-2 border-t-2 border-neutral">
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
                <div className={'mb-2 mx-2'}>
                    <div className="relative">
                        <Input type="number"
                               value={nights}
                               placeholder={'Nights'}
                               onChange={(e) => setNights(parseInt(e.target.value))}
                               className="min-w-0 mb-2"
                               inputMode="numeric"
                               pattern="[0-9]*"
                        />
                        <div
                            className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3  peer-disabled:opacity-50">
                            <MoonStar size={16} strokeWidth={2} aria-hidden="true"/>
                        </div>
                    </div>
                    <div className={'flex items-center gap-2'}>
                        <Button onClick={() => {
                            setIsOpened(false)
                        }} variant="outline" className="w-full">
                            Cancel
                        </Button>
                        <Button onClick={() => {
                            handlePopoverClose();
                            setIsOpened(false)
                        }} className="w-full">
                            Done
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

