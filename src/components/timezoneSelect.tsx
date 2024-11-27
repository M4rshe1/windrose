"use client"
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {useMemo} from "react";

export default function TimezoneSelect({updateTimezoneAction, defaultValue, ...props}: { updateTimezoneAction: (timezone: string) => void,defaultValue: string, [key: string]: unknown }) {
    const timezones = Intl.supportedValuesOf("timeZone");

    const formattedTimezones = useMemo(() => {
        return timezones
            .map((timezone) => {
                const formatter = new Intl.DateTimeFormat("en", {
                    timeZone: timezone,
                    timeZoneName: "shortOffset",
                });
                const parts = formatter.formatToParts(new Date());
                const offset = parts.find((part) => part.type === "timeZoneName")?.value || "";
                const modifiedOffset = offset === "GMT" ? "GMT+0" : offset;

                return {
                    value: timezone,
                    label: `(${modifiedOffset}) ${timezone.replace(/_/g, " ")}`,
                    numericOffset: parseInt(offset.replace("GMT", "").replace("+", "") || "0"),
                };
            })
            .sort((a, b) => a.numericOffset - b.numericOffset);
    }, [timezones]);

    return (
        <div className="space-y-2">
            <Label htmlFor="select-30">Timezone</Label>
            <Select defaultValue={defaultValue} name="timezone"
                onValueChange={updateTimezoneAction}

            >
                <SelectTrigger id="select-30" {...props}>
                    <SelectValue placeholder="Select timezone"/>
                </SelectTrigger>
                <SelectContent>
                    {formattedTimezones.map(({value, label}) => (
                        <SelectItem key={value} value={value}>
                            {label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
