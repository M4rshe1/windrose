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
import {Gender} from "@prisma/client";
import RadioGroupBordered from "@/components/radioGroupBordered";
import GoToPersonalProfileButton from "@/components/goToPersonalProfileButton";
import {SettingsSecondaryNav} from "@/components/secondaryNavs";

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

    async function updateName(name: string) {
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

    async function updateGender(gender: string) {
        "use server"

        if (!Object.values(Gender).includes(gender as Gender)) {
            return;
        }

        await db.user.update({
            where: {id: session?.user.id},
            data: {
                gender: gender as Gender
            }
        })
        return revalidatePath('/settings/profile');
    }

    async function updateMeasurementSystem(system: string) {
        "use server"

        await db.user.update({
            where: {id: session?.user.id},
            data: {
                metric: system === 'METRIC'
            }
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
            <SettingsSecondaryNav activeTab={"Profile"}/>
            <div className="flex flex-1 flex-col gap-4 p-4 lg:max-w-screen-lg max-w-lg w-full mx-auto ">
                <div className={cn(`flex flex-col gap-2 w-full`)}>
                    <GoToPersonalProfileButton username={session?.user?.username as string}/>
                    <H1>Public Profile</H1>
                    <div className={cn(`grid lg:grid-cols-[1fr_auto] grid-cols-1 gap-8`)}>
                        <div className={cn('flex flex-col gap-3')}>
                            <SubtitleInput labelText={`Name`} type={`text`} name={`name`} id={`name`}
                                           defaultValue={session?.user?.name as string}
                                           subText={`This is the name that will be displayed on your profile. You can remove it at any time.`}
                                           onBlurAction={updateName}
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
                                        subLabel: 'Everyone',
                                        description: 'Your email is visible on your profile to everyone.',
                                        value: 'visible'
                                    },
                                    {
                                        label: 'Hidden',
                                        subLabel: 'Only you',
                                        description: 'Your email will be hidden from everyone.',
                                        value: 'hidden'
                                    }
                                ]}
                                                   defaultValue={user?.showEmail ? 'visible' : 'hidden'}
                                                   onClickAction={updateShowEmail}
                                />
                            </div>
                            <Label htmlFor={`gender`} className={cn('block')}>Gender</Label>
                            <RadioGroupBordered items={
                                [
                                    {
                                        label: `Male`,
                                        subLabel: `He/Him`,
                                        description: `Just your average dude.`,
                                        value: Gender.MALE as string
                                    },
                                    {
                                        label: `Female`,
                                        subLabel: `She/Her`,
                                        description: `Rocking the queen vibes!`,
                                        value: Gender.FEMALE as string
                                    },
                                    {
                                        label: `Unknown`,
                                        description: `Classified information... for now.`,
                                        value: Gender.UNKNOWN as string
                                    }
                                ]
                            } classNameWrapper={`grid lg:grid-cols-2 grid-cols-1`} onClickAction={updateGender}
                                                defaultValue={user?.gender as string}
                            />

                        </div>
                        <ProfilePictureInput session={session as Session}/>
                    </div>
                    <H2 className={"mt-8"}>Socials</H2>
                    <SocialLinksSettings socials={
                        user?.Social as { name: string, url: string, id: string, userId: string }[] || []
                    } updateSocialsAction={updateSocials}
                    />
                    <H2 className={"mt-8"}>Measurement System</H2>

                    <RadioGroupBordered items={
                        [
                            {
                                label: `Metric`,
                                description: `Centimeters and kilograms`,
                                value: 'METRIC'
                            },
                            {
                                label: `Imperial`,
                                description: `Inches and pounds`,
                                value: 'IMPERIAL'
                            }
                        ]
                    } classNameWrapper={`grid lg:grid-cols-2 grid-cols-1`} onClickAction={updateMeasurementSystem}
                                        defaultValue={user?.metric ? 'METRIC' : 'IMPERIAL'}
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
                                          counties.map(country => ({
                                              label: country.name,
                                              value: country.id,
                                              flag: <ReactCountryFlag countryCode={country.code} svg
                                                                      className={cn('mr-2')}/>,
                                              color: country.color
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