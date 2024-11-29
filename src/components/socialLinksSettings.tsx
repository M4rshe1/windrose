"use client";

import {useEffect, useState} from "react";
import {Social} from "@prisma/client";
import IconInput from "@/components/iconInput";
import {SOCIALS} from "@/lib/socials";
import {IconLink, IconPlus, IconTrash} from "@tabler/icons-react";
import SelectWithIcons from "@/components/selectWithIcons";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";


const SocialLinksSettings = ({socials, updateSocialsAction}: {
    socials: Social[],
    updateSocialsAction: (socials: Social[]) => void
}) => {
    const [socialLinks, setSocialLinks] = useState(socials);
    const [socialOptions, setSocialOptions] = useState(SOCIALS.map(s => ({
        label: s.name,
        value: s.name,
        icon: s.icon
    })).filter(s => !socialLinks.find(sl => sl.name === s.label)));

    useEffect(() => {
        setSocialOptions(SOCIALS.filter(s => !socialLinks.find(sl => sl.name === s.name)).map(s => ({
                label: s.name,
                value: s.name,
                icon: s.icon
            }))
        );
    }, [socialLinks]);

    function addSocial(formData: FormData) {
        const name = formData.get('social') as string
        if (!SOCIALS.find(s => s.name === name)) return;
        setSocialLinks([...socialLinks,
            {
                name: name,
                url: '',
                id: '',
                userId: ''
            }]);
    }

    function updateSocial(name: string, url: string) {
        const updatedSocials = socialLinks.map(social => social.name === name ? {
            ...social,
            url
        } : social);
        setSocialLinks(updatedSocials);
        updateSocialsAction(updatedSocials.filter(social => social.url !== ''));
    }

    function removeSocial(name: string) {
        const updatedSocials = socialLinks.filter(social => social.name !== name);
        setSocialLinks(updatedSocials);
        updateSocialsAction(updatedSocials.filter(social => social.url !== ''));
    }


    return (
        <div className="space-y-4">
            <form action={addSocial} className="flex gap-2">
                <SelectWithIcons options={socialOptions} className={cn('w-48')} name={'social'} label={"Social"}/>
                <Button className={cn('w-24 text-primary-content')}>
                    <IconPlus/>
                </Button>
            </form>
            {socialLinks.map((social, index) => (
                <div key={index} className="flex space-x-4">
                    <IconInput
                        Icon={SOCIALS.find(s => s.name === social.name)?.icon || IconLink}
                        placeholder={SOCIALS.find(s => s.name === social.name)?.url || 'URL'}
                        defaultValue={social.url}
                        //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        onBlur={(e) => updateSocial(social.name, e.target.value)}
                    />
                    <Button className={cn('text-neutral-content bg-neutral hover:text-error-content hover:bg-error')}
                            onClick={() => removeSocial(social.name)}>
                        <IconTrash/>
                    </Button>
                </div>
            ))}
        </div>
    );
}

export default SocialLinksSettings;