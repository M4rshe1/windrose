"use client"

import {SecondaryNavPortal} from "@/components/secondaryHeaderNav";
import React from "react";
import {
    AtSign,
    BellDot, BookOpen, ChartNoAxesGantt,
    CreditCard,
    ListPlus,
    Map,
    Pen,
    Route,
    Settings,
    ShieldPlus,
    User,
    UserPen
} from "lucide-react";
import {TourToUserRole, UserRole} from "@prisma/client";

export const UserSecondaryNav = ({activeTab, username, isProfileOwner, tours}: {
    activeTab: string,
    username: string,
    tours: number,
    isProfileOwner: boolean,
}) => {
    const items = [
        {
            title: 'Overview', url: `/${username}`, icon: BookOpen
        },
        {
            title: 'Tours', url: `/${username}/tours`, icon: Route, badge: tours
        },
        {
            title: 'Timeline', url: `/${username}/timeline`, icon: ChartNoAxesGantt
        }, 
        {
            title: 'Following', url: `/${username}/following`, icon: AtSign
        }, 
        {
            title: 'Followers', url: `/${username}/followers`, icon: AtSign
        },
        {
            title: 'Saved', url: `/${username}/saved`, icon: ListPlus
        }
    ]

    if (isProfileOwner) {
        items.push(
            {
                title: 'Settings', url: `settings`, icon: Settings
            }
        )
    }
    return (
        <SecondaryNavPortal items={items.map(item => {
            if (item.title === activeTab) {
                return {...item, active: true}
            }
            return item
        })}/>
    )
}

export const TourSettingsSecondaryNav = ({activeTab, params, sectionCount, userRole, mentionsCount}: {
    activeTab: string,
    params: { username: string, tour: string },
    sectionCount: number
    mentionsCount: number
    userRole: string | TourToUserRole | UserRole
}) => {
    const items = [
        {
            title: 'Overview', url: `/${params.username}/${params.tour}`, icon: Map
        },
        {
            title: 'Steps', url: `/${params.username}/${params.tour}/steps`, icon: Route, badge: sectionCount
        },
        {
            title: 'Mentions', url: `/${params.username}/${params.tour}/mentions`, icon: AtSign, badge: mentionsCount
        }
    ]
    if (userRole === TourToUserRole.OWNER || userRole === TourToUserRole.EDITOR || userRole === UserRole.ADMIN) {
        items.push(
            {
                title: 'New step', url: `/${params.username}/${params.tour}/new`, icon: ListPlus
            },
            {
                title: 'Settings', url: `/${params.username}/${params.tour}/settings`, icon: Settings
            }
        )
    }
    return (
        <SecondaryNavPortal items={items.map(item => {
            if (item.title === activeTab) {
                return {...item, active: true}
            }
            return item
        })}/>
    )
}

export const SettingsSecondaryNav = ({activeTab}: { activeTab: string }) => {
    const items = [
        {
            title: 'Overview', url: '/settings', icon: Settings
        },
        {
            title: 'Appearance', url: '/settings/appearance',
            icon: Pen
        },
        {
            title: 'Sessions', url: '/settings/sessions',
            icon: ShieldPlus
        },
        {
            title: 'Account', url: '/settings/account',
            icon: User
        },
        {
            title: 'Profile', url: '/settings/profile',
            icon: UserPen
        },
        {
            title: 'Notifications', url: '/settings/notifications',
            icon: BellDot
        },
        {
            title: 'Billing', url: '/settings/billing',
            icon: CreditCard
        }
    ].map(item => {
        if (item.title === activeTab) {
            return {...item, active: true}
        }
        return item
    })
    return (
        <SecondaryNavPortal items={items}/>
    )
}

