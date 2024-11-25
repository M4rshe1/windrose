"use client"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import react, {useEffect, useState} from "react"
import ReactDOM from "react-dom";


interface BreadcrumbProps {
    items: {
        title: string;
        url: string;
    }[]
}


export const BreadcrumbPortal = ({items}: BreadcrumbProps) => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)

        return () => setMounted(false)
    }, [])

    return mounted
        ? ReactDOM.createPortal(
            <BreadcrumbBar items={items}/>,
            document.getElementById('breadcrumb-bar') as HTMLElement
        )
        : null
};

export const BreadcrumbBar = ({items}: BreadcrumbProps) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {
                    items.map((item, index) => (
                        <react.Fragment key={index}>
                            <BreadcrumbItem
                                className={"hover:bg-base-200 rounded-lg p-2 transition-all duration-200 ease-in-out"}
                                key={index}>
                                <BreadcrumbLink href={item.url}>
                                    {item.title}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {index < items.length - 1 && (
                                <BreadcrumbSeparator/>
                            )}
                        </react.Fragment>
                    ))
                }
            </BreadcrumbList>
        </Breadcrumb>
    )
}
