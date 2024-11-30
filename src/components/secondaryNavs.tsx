"use client"

import {SecondaryNavPortal} from "@/components/secondaryHeaderNav";
import React from "react";
import {BellDot, CreditCard, Map, Pen, Route, Settings, ShieldPlus, User, UserPen} from "lucide-react";
import {TourToUserRole, UserRole} from "@prisma/client";

export const TourSettingsSecondaryNav = ({activeTab, params, sectionCount, userRole}: {
    activeTab: string,
    params: { username: string, tour: string },
    sectionCount: number
    userRole: string | TourToUserRole | UserRole
}) => {
    const items = [
        {
            title: 'Overview', url: `/${params.username}/${params.tour}`, icon: Map
        },
        {
            title: 'Steps', url: `/${params.username}/${params.tour}/steps`, icon: Route, badge: sectionCount
        }
    ]
    if (userRole === TourToUserRole.OWNER || userRole === TourToUserRole.EDITOR || userRole === UserRole.ADMIN) {
        items.push({
            title: 'Settings', url: `/${params.username}/${params.tour}/settings`, icon: Settings
        })
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

