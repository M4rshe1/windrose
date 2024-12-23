'use client'

import Form from "@/components/form";
import {cn, stringToDashCase} from "@/lib/utils";
import SearchSelect from "@/components/SearchSelect";
import SubtitleInput from "@/components/subtitleInput";
import {Label} from "@/components/ui/label";
import RadioGroupLabeled from "@/components/radioGroupLabeled";
import {Button} from "@/components/ui/button";
import React, {ChangeEvent, useEffect, useState} from "react";
import {createTourAction} from "@/actions/createTourAction";
import {checkTourNameAction} from "@/actions/checkTourNameAction";
import {TourStatus, TourVisibility} from "@prisma/client";
import RadioGroupBordered from "@/components/radioGroupBordered";

const CreateTourForm = ({options}: { options: { label: string, value: string, image?: string }[] }) => {
    const [owner, setOwner] = useState(options[0].value);
    const [displayName, setDisplayName] = useState<null | string>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState<TourVisibility | string>(TourVisibility.PUBLIC);
    const [tourNameInvalid, setTourNameInvalid] = useState(false);
    const [displayNameInvalid, setDisplayNameInvalid] = useState(false);
    const [namePlaceholder, setNamePlaceholder] = useState('');
    const [status, setStatus] = useState<string | TourStatus>(TourStatus.ON_TOUR);


    useEffect(() => {
        if (displayName === null) {
            return;
        }
        if (displayName.length === 0) {
            setDisplayNameInvalid(true);
        } else {
            setDisplayNameInvalid(false);
            setNamePlaceholder(stringToDashCase(displayName));
            checkTourNameAction(stringToDashCase(displayName)).then((result) => {
                setTourNameInvalid(!result);
            });
        }
    }, [displayName]);

    function tourNameBlurHandler() {
        if (name.length !== 0) {
            checkTourNameAction(name).then((result) => {
                setTourNameInvalid(!result);
            });
        }
    }

    const submitHandler = async () => {
        if (tourNameInvalid || displayNameInvalid || !displayName) {
            if (!displayName) {
                setDisplayNameInvalid(true);
            }
            if (name.length === 0) {
                setTourNameInvalid(true);
            }
            if (displayNameInvalid || tourNameInvalid) {
                return;
            }
            return;
        }
        const tourName = name || stringToDashCase(displayName);
        await createTourAction(owner, tourName, description, displayName, visibility as TourVisibility, status as TourStatus);
    }

    return <Form serverAction={submitHandler}>
        <div className={cn(`flex flex-col gap-4 w-full`)}>
            <div className={'flex w-full flex-col'}>
                <div className={'flex w-full gap-2'}>
                    <SearchSelect options={options} name={`owner`} label={`Owner`}
                                  defaultValue={options[0].label}
                                  className={cn(`lg:max-w-[16rem] w-full`)}
                                  onChangeAction={setOwner}
                    />
                    <div className={cn('self-end py-1 font-semibold text-2xl')}>
                        /
                    </div>
                    <SubtitleInput labelText={`Tour display name`} type={`text`} name={`displayName`}
                                   id={`displayName`}
                                   defaultValue={``}
                                   onBlurAction={setDisplayName}
                                   className={cn(`lg:max-w-[16rem] w-full`)}
                    />
                </div>
                <p className={cn("text-xs text-error mt-2")} role="region" aria-live="polite">
                    {displayNameInvalid ? 'Display name is required' : ''}
                </p>
            </div>
            <div>
                <SubtitleInput labelText={`Tour name`} type={`text`} name={`name`} id={`name`}
                               value={name}
                               onChange={(e: ChangeEvent<HTMLInputElement>) => setName(stringToDashCase(e.target.value))}
                               onBlurAction={tourNameBlurHandler}
                               className={cn(`lg:max-w-[16rem] w-full`)}
                               placeholder={namePlaceholder}
                               subText={`This will be in the URL of your tour. It can't be changed`}
                />
                <p className={cn("text-xs text-error mt-2")} role="region" aria-live="polite">
                    {tourNameInvalid ? 'Tour name already exists or is invalid' : ''}
                </p>
            </div>
            <SubtitleInput labelText={`Description`} type={`text`} name={`description`}
                           id={`description`}
                           defaultValue={``}
                           onBlurAction={setDescription}
                           className={cn(`w-full`)}
                           subText={`(Optional) A short description of the tour.`}
            />
            <div className={cn('flex flex-col gap-4 mt-2')}>
                <Label className={cn('block')}>Visibility</Label>
                <RadioGroupLabeled items={
                    [
                        {
                            label: 'Public',
                            description: 'Anyone can view this tour.',
                            value: TourVisibility.PUBLIC
                        },
                        {
                            label: 'Follower',
                            description: 'Only your followers can view this tour.',
                            value: TourVisibility.FOLLOWERS
                        },
                        {
                            label: 'Private',
                            description: 'Only you and people you invite can view this tour.',
                            value: TourVisibility.PRIVATE
                        }
                    ]
                } name={`visibility`} label={`Visibility`} defaultValue={TourVisibility.FOLLOWERS} onClickAction={setVisibility}/>
            </div>
            <div className={cn('flex flex-col gap-4 mt-2')}>
                <Label className={cn('block')}>Status</Label>
                <RadioGroupBordered items={
                    [
                        {
                            label: `Planning`,
                            value: TourStatus.PLANNING,
                            description: `I have this idea in my head.`
                        },
                        {
                            label: `On Tour`,
                            value: TourStatus.ON_TOUR,
                            description: `I don't want to forget this.`
                        },
                        {
                            label: `Finished`,
                            value: TourStatus.FINISHED,
                            description: `I'm done with this.`
                        }
                    ]
                } name={`status`} label={`Status`} defaultValue={TourStatus.ON_TOUR} onClickAction={setStatus}
                                    classNameWrapper={cn(`grid lg:grid-cols-2 grid-cols-1`)}
                />
            </div>
            <div className={cn('p-4 border-y-2 border-neutral')}>
                <p className={cn('text-sm opacity-70')}>
                    You are creating a new tour as <span className={cn('font-semibold')}>{
                    options.find((option) => option.value === owner)?.label
                }</span> that is <span className={cn('font-semibold')}>
                    {
                        visibility == TourVisibility.PUBLIC ? 'public' : visibility == TourVisibility.FOLLOWERS ? 'followers only' : 'private'
                    }
                </span> and <span className={cn('font-semibold')}>
                    {
                        status == TourStatus.PLANNING ? 'is planed' : status == TourStatus.ON_TOUR ? 'on going' : 'finished'
                    }
                </span>.
                </p>
            </div>


            <div className={cn('flex items-center justify-end')}>
                <Button type="submit" className={cn(`bg-primary text-primary-content`)}>
                    Create Tour
                </Button>
            </div>
        </div>
    </Form>
}

export default CreateTourForm