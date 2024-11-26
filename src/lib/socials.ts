import {
    IconBrandFacebook,
    IconBrandGithub,
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandX,
    IconBrandYoutube,
    TablerIcon
} from "@tabler/icons-react";
import {Globe, LucideIcon} from "lucide-react";

export interface Social {
    name: string;
    url: string;
    icon: TablerIcon | LucideIcon;
}


export const SOCIALS: Social[] = [
    {
        name: 'X',
        url: 'https://x.com/@username',
        icon: IconBrandX,
    },
    {
        name: 'GitHub',
        url: 'https://github.com/@username',
        icon: IconBrandGithub,
    },
    {
        name: 'LinkedIn',
        url: 'https://linkedin.com/in/@username',
        icon: IconBrandLinkedin,
    },
    {
        name: 'Instagram',
        url: 'https://instagram.com/@username',
        icon: IconBrandInstagram,
    },
    {
        name: 'Website',
        url: 'https://windrose.heggli.dev',
        icon: Globe
    },
    {
        name: 'Facebook',
        url: 'https://facebook.com/@username',
        icon: IconBrandFacebook,
    },
    {
        name: 'YouTube',
        url: 'https://youtube.com/@username',
        icon: IconBrandYoutube,
    },
]
