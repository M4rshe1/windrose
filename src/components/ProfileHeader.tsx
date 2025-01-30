import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {cn, distanceReadable, getMinioLinkFromKey} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {SOCIALS} from "@/lib/socials";
import {LinkIcon, PiggyBank, Sparkles} from "lucide-react";
import React from "react";
import {ExtendedTour, ExtendedUser} from "@/lib/userProfileInterfaces";
import {Session} from "next-auth";
import GoToProfileSettingsButton from "@/components/goToProfileSettingsButton";
import FancyBorder from "@/components/ui/fancyBorder";

const ProfileHeader = ({user, tours, params, session}: {
    user: ExtendedUser,
    tours: ExtendedTour[],
    params: { username: string },
    session: Session | null
}) => {

    return (
        <div>
            <div className="flex gap-6">
                <Avatar className="w-32 h-32 bg-neutral">
                    <AvatarImage src={getMinioLinkFromKey(user?.image?.fileKey as string)}
                                 alt={user?.name as string}/>
                    <AvatarFallback className={`text-3xl`}>
                        {user?.name?.split(" ").map(name => name[0].toUpperCase()).join("")}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div
                        className={cn("flex items-center justify-between")}
                    >
                        <h1 className="text-2xl font-bold rounded-md flex items-center gap-2">
                            {user?.name}
                            {
                                user.role === "ADMIN" &&
                                <FancyBorder className={'rounded'}>
                                    <div className="bg-base-300 text-sm z-30 flex items-center pr-1">
                                        <Sparkles className={`scale-75`}/>
                                        Admin
                                    </div>
                                </FancyBorder>
                            }
                            {
                                user.role === "PREMIUM" && (
                                    <div
                                        className={cn(
                                            "rounded",
                                            "bg-primary text-sm flex items-center p-[3px]",
                                            "glow-effect",
                                            "text-primary"
                                        )}
                                    >
                                        <div className="bg-base-300 rounded-sm text-sm z-30 flex items-center pr-1 text-base-content">
                                            <PiggyBank className={`scale-75`} />
                                            Premium
                                        </div>
                                    </div>
                                )
                            }

                        </h1>
                        {
                            session?.user?.username === params.username &&
                            <GoToProfileSettingsButton/>
                        }
                    </div>
                    <p className="text-neutral-500">@{user?.username}</p>
                    <p className={cn("mt-2 text-sm", {"italic": !user?.bio})}>{user?.bio || "This user hasn't added a bio yet."}</p>
                    {session?.user?.username !== params.username && <Button className="mt-4">Follow</Button>}
                    <div className="flex gap-4 mt-4">
                        {user?.Social.map(({name, url}) => {
                            let SocialIcon = SOCIALS.find(s => s.name === name)?.icon;
                            if (!SocialIcon) SocialIcon = LinkIcon;
                            return (
                                <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                                   className="text-blue-500 hover:underline flex items-center gap-2">
                                    {SocialIcon && <SocialIcon size={20}/>}
                                    {name}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="flex gap-6 mt-4 border-b-2 border-neutral pb-4">
                <span><strong>{tours.length}</strong> Tours</span>
                <span><strong>{user?.Saved.length}</strong> Saved</span>
                <span><strong>N/A</strong> Followers</span>
                <span><strong>N/A</strong> Following</span>
                <span><strong>
                        {[...new Set(tours.map((tour) => tour).map(tour => tour.sections).flat().map(section => section?.country?.code).filter(country => country))].length}
                    </strong> Countries</span>
                <span><strong>
                        {distanceReadable(tours.map((tour) => tour).map(tour => tour.sections).flat().reduce((acc, section) => acc + (section?.distance || 0), 0) || 0, session?.user?.metric || true, 0)}
                    </strong> Travel Distance</span>
            </div>
        </div>
    );
}

export default ProfileHeader;