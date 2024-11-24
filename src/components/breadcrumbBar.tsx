import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import react from "react"
import {createPortal} from "react-dom";



interface BreadcrumbProps {
    items: {
        title: string;
        url: string;
    }[]
}

export function setBreadcrumbBar(items: { title: string; url: string; }[]) {
    const breadcrumbContainer = document.getElementById("breadcrumb");
    if (breadcrumbContainer) {
        createPortal(<BreadcrumbBar items={items} />, breadcrumbContainer);
    }
}

export const BreadcrumbBar = ({items}: BreadcrumbProps) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {
                    items.map((item, index) => (
                        <react.Fragment key={index}>
                            <BreadcrumbItem className={" hover:bg-base-200 rounded-lg p-2 transition-all duration-200 ease-in-out"} key={index}>
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
