"use client"

import {SecondaryNavPortal} from "@/components/secondaryHeaderNav";
import React from "react";
import {BellDot, CreditCard, Map, Pen, Route, Settings, ShieldPlus, User, UserPen} from "lucide-react";

export const TourSettingsSecondaryNav = ({activeTab, params, sectionCount}: {
    activeTab: string,
    params: { username: string, tour: string },
    sectionCount: number
}) => {
    const items = [
        {
            title: 'Overview', url: `/${params.username}/${params.tour}`, icon: Map
        },
        {
            title: 'Steps', url: `/${params.username}/${params.tour}/steps`, icon: Route, badge: sectionCount
        },
        {
            title: 'Settings', url: `/${params.username}/${params.tour}/settings`, icon: Settings
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

