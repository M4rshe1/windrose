import {BreadcrumbPortal} from "@/components/breadcrumbBar";
import {getServerSession, Session} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import H1 from "@/components/ui/h1";
import {cn} from "@/lib/utils";
import SubtitleInput from "@/components/subtitleInput";
import ProfilePictureInput from "@/components/profilePictureInput";
import db from "@/lib/db";
import React from "react";
import LimitedTextarea from "@/components/limitedTextarea";
import H2 from "@/components/ui/h2";
import RadioGroupLabeled from "@/components/radioGroupLabeled";
import {Label} from "@/components/ui/label";
import SocialLinksSettings from "@/components/socialLinksSettings";
import {revalidatePath} from "next/cache";
import TimezoneSelect from "@/components/timezoneSelect";
import SearchSelect from "@/components/SearchSelect";
import ReactCountryFlag from "react-country-flag";
import {Button} from "@/components/ui/button";
import Link from "next/link";

const ProfileSettings = async () => {
    const session: Session | null = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return;
    }

    const [user, counties] = await Promise.all([
        db.user.findUnique({
            where: {id: session?.user?.id},
            include: {
                image: true,
                Social: true
            }
        }),
        db.country.findMany()
    ])

    async function updateUsername(name: string) {
        "use server"

        const result = await db.user.update({
            where: {id: session?.user.id},
            data: {
                name: name
            },
        })
        return result.username;
    }

    async function updateBio(bio: string) {
        "use server"

        await db.user.update({
            where: {id: session?.user.id},
            data: {
                bio: bio
            },
        })
        return revalidatePath('/settings/profile');
    }

    async function updateShowEmail(value: string) {
        "use server"

        const showEmail = value === 'visible';

        await db.user.update({
            where: {id: session?.user.id},
            data: {
                showEmail: showEmail
            },
        })
        return revalidatePath('/settings/profile');
    }

    async function updateSocials(socials: { name: string, url: string, id: string, userId: string }[]) {
        "use server"

        // delete all existing socials
        await db.social.deleteMany({
            where: {
                userId: session?.user.id
            }
        })

        // create new socials
        await db.social.createMany({
            data: socials.map(social => ({
                name: social.name,
                url: social.url,
                userId: session?.user.id as string
            }))
        })
        return revalidatePath('/settings/profile');
    }

    async function updateLocation(location: string) {
        "use server"

        await db.user.update({
            where: {id: session?.user.id},
            data: {
                location: location
            },
        })
        return revalidatePath('/settings/profile');
    }

    async function updateTimezone(timezone: string) {
        "use server"

        await db.user.update({
            where: {id: session?.user.id},
            data: {
                tz: timezone
            },
        })
        return revalidatePath('/settings/profile');
    }

    async function updateCountry(countryId: string) {
        "use server"

        await db.user.update({
            where: {id: session?.user.id},
            data: {
                countryId: countryId
            },
        })
        return revalidatePath('/settings/profile');
    }

    return (
        <>
            <BreadcrumbPortal items={
                [
                    {
                        title: 'Settings', url: '/settings'
                    },
                    {
                        title: 'Profile', url: '/settings/profile'
                    }
                ]
            }/>
            <div className="flex flex-1 flex-col gap-4 p-4 lg:max-w-screen-lg max-w-lg w-full mx-auto ">
                <div className={cn(`flex flex-col gap-2 w-full`)}>
                    <div className={cn('flex items-center justify-end')}>
                        <Link href={`/${session?.user?.username || session?.user?.id as string}`}>
                            <Button variant={`outline`} size={`sm`}
                                    className={cn(`bg-base-100 hover:bg-base-200 cursor-pointer`)}

                            >Go to your personal profile</Button>
                        </Link>
                    </div>
                    <H1>Public Profile</H1>
                    <div className={cn(`grid lg:grid-cols-[1fr_auto] grid-cols-1 gap-8`)}>
                        <div className={cn('flex flex-col gap-3')}>
                            <SubtitleInput labelText={`Name`} type={`text`} name={`name`} id={`name`}
                                           defaultValue={session?.user?.name as string}
                                           subText={`This is the name that will be displayed on your profile. You can remove it at any time.`}
                                           onBlurAction={updateUsername}
                            />
                            <LimitedTextarea maxLength={200} className={cn('min-h-24')} title={`Bio`}
                                             placeholder={`Tell us about yourself...`} name={`bio`} id={`bio`}
                                             onBlurAction={updateBio}
                                             initialValue={user?.bio || ""}/>
                            <div className={cn('flex flex-col gap-4')}>
                                <Label htmlFor={`visibility`} className={cn('block')}>Email Visibility</Label>
                                <RadioGroupLabeled items={[
                                    {
                                        label: 'Visible',
                                        sublabel: 'Everyone',
                                        description: 'Your email is visible on your profile to everyone.',
                                        value: 'visible'
                                    },
                                    {
                                        label: 'Hidden',
                                        sublabel: 'Only you',
                                        description: 'Your email will be hidden from everyone.',
                                        value: 'hidden'
                                    }
                                ]}
                                                   defaultValue={user?.showEmail ? 'visible' : 'hidden'}
                                                   onClickAction={updateShowEmail}
                                />
                            </div>
                        </div>
                        <ProfilePictureInput session={session as Session}/>
                    </div>
                    <H2 className={"mt-8"}>Socials</H2>
                    <SocialLinksSettings socials={
                        user?.Social as { name: string, url: string, id: string, userId: string }[] || []
                    } updateSocialsAction={updateSocials}
                    />
                    <H2 className={"mt-8"}>Location</H2>
                    <SubtitleInput labelText={`Location`} type={`text`} name={`location`} id={`location`}
                                   defaultValue={user?.location || ""}
                                   subText={`This can be a city, state, country, or any other location you want to share.`}
                                   onBlurAction={updateLocation}
                                   className={cn(`lg:max-w-[16rem] w-full`)}
                    />
                    <TimezoneSelect updateTimezoneAction={updateTimezone} defaultValue={user?.tz || ""}
                                    className={cn(`lg:max-w-[16rem] w-full`)}/>
                    <div className={'flex w-full gap-2'}>
                        <SearchSelect name={`country`} label={`Country`} onChangeAction={updateCountry}
                                      defaultValue={counties.find(county => county.id === user?.countryId)?.name || ""}
                                      className={cn(`lg:max-w-[16rem] w-full`)}
                                      options={
                                          counties.map(county => ({
                                              label: county.name,
                                              value: county.id,
                                              flag: <ReactCountryFlag countryCode={county.code} svg
                                                                      className={cn('mr-2')}/>,
                                              color: county.color
                                          }))
                                      }
                        />
                    </div>
                </div>
                <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min"/>
            </div>
        </>
    );
}

export default ProfileSettings;