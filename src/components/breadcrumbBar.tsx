"use client"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import react, {useEffect} from "react"
import ReactDOM from "react-dom";
import {createRoot} from "react-dom/client";


interface BreadcrumbProps {
    items: {
        title: string;
        url: string;
    }[]
}


export const BreadcrumbPortal = ({items}: BreadcrumbProps) => {
    useEffect(() => {
        const breadcrumbContainer = document.getElementById("breadcrumb-bar");
        if (breadcrumbContainer) {
            const breadcrumb = ReactDOM.createPortal(<BreadcrumbBar items={items}/>, breadcrumbContainer);
            const root = createRoot(breadcrumbContainer);
            root.render(breadcrumb);
        }
    }, [items]);

    return null;
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
