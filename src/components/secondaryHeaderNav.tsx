import {useEffect, useState} from "react";
import ReactDOM from "react-dom";

interface SecondaryHeaderNavProps {
    items: {
        title: string;
        url: string;
    }[]
}

export const BreadcrumbPortal = ({items}: SecondaryHeaderNavProps) => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)

        return () => setMounted(false)
    }, [])

    return mounted
        ? ReactDOM.createPortal(
            <SecondaryHeaderNav items={items}/>,
            document.getElementById('secondary-header-nav') as HTMLElement
        )
        : null
};

export const SecondaryHeaderNav = ({items}: SecondaryHeaderNavProps) => {
    return (
        <div>
            <ul>
                {
                    items.map((item, index) => (
                        <li key={index}>
                            <a href={item.url}>
                                {item.title}
                            </a>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}