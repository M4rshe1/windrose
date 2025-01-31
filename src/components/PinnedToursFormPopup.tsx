"use client";

import * as React from "react";
import {useState} from "react";
import {ExtendedTour} from "@/lib/userProfileInterfaces";
import {Dialog, DialogContent, DialogTitle, DialogTrigger,} from "./ui/dialog";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";
import {TourToUserRole} from "@prisma/client";

const PinnedToursFormPopup = ({
                                  tours,
                                  pinToursAction,
                                  username
                              }: {
    tours: ExtendedTour[];
    pinToursAction: (pins: string[]) => void;
    username: string;
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [pinned, setPinned] = useState<string[]>(tours.filter(tour => tour.TourToUser.some(ttu => ttu.pinned && ttu.user.username == username)).map(tour => tour.id));
    const [open, setOpen] = useState(false);
    const filteredTours = tours.filter((tour) =>
        tour.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    
    return (
        <Dialog open={open}>
            <DialogTrigger>
                <Button variant="outline" size={`sm`} onClick={() => setOpen(true)}>Pin Tours</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogTitle className="hidden">Pin Tours</DialogTitle>
                <h1 className="text-xl font-bold mb-4">Select Tours to Pin</h1>
                <Input
                    type="text"
                    placeholder="Filter tours"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-4 border-neutral"
                />
                <div className="space-y-4">
                    <ScrollArea className="max-h-60 border-2 border-neutral rounded-md p-2">
                        <div className="grid gap-2">
                            {filteredTours.map((tour) => {
                                const owner = tour.TourToUser.find(ttu => ttu.role == TourToUserRole.OWNER)?.user;
                                return (
                                    <div
                                        key={tour.id}
                                        className="flex items-center justify-between group/tour"
                                    >
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={tour.id}
                                                onClick={() => {
                                                    if (pinned.includes(tour.id)) {
                                                        setPinned(pinned.filter((id) => id !== tour.id));
                                                    } else {
                                                        setPinned([...pinned, tour.id]);
                                                    }
                                                }}
                                                defaultChecked={tour.TourToUser.some(ttu => ttu.pinned && ttu.user.username == username)}
                                                className="mr-2 accent-primary"
                                            />
                                            <label
                                                htmlFor={tour.id}
                                                className="text-lg relative h-5"
                                            >
                                     <span
                                         className={cn('truncate text-sm absolute transition-all duration-300 ease-in-out', 'group-hover/tour:translate-y-[-100%] group-hover/tour:opacity-0')}>
                                         {
                                             owner?.username == username ? `${tour.displayName}` : `${owner?.name}/${tour.displayName}`
                                         }
                                     </span>
                                                <span
                                                    className={cn('truncate text-sm absolute transition-all duration-300 ease-in-out opacity-0', 'translate-y-[100%] group-hover/tour:translate-y-0 group-hover/tour:opacity-100')}>
                                    {
                                        owner?.username == username ? `${tour.name}` : `${owner?.username}/${tour.name}`
                                    }
                                </span>
                                            </label>
                                        </div>
                                        {/*<span className="text-sm text-gray-500">*/}
                                        {/*    {1 || 0}*/}
                                        {/*</span>*/}
                                    </div>
                                )
                            })}
                            {filteredTours.length === 0 && (
                                <p className="text-center text-gray-500">
                                    No tours found.
                                </p>
                            )}
                        </div>
                    </ScrollArea>
                    <div className="flex justify-end">
                        <div role={"button"} className={"btn btn-sm btn-primary"} onClick={() => {
                            pinToursAction(pinned);
                            setOpen(false);
                        }}>Save
                            Pins
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PinnedToursFormPopup;
