import {LucideIcon} from "lucide-react";
import {TablerIcon} from "@tabler/icons-react";
import {cn} from "@/lib/utils";
import React from "react";


const TitleContainer = ({title, Icon, fill, children, border}: {
    children: React.ReactNode,
    fill: `primary` | `secondary` | `accent` | `base-100` | `base-200` | `base-300` | `neutral`
    border?: `primary` | `secondary` | `accent` | `base-100` | `base-200` | `base-300` | `neutral`
    title: string,
    Icon?: LucideIcon | TablerIcon
}) => {

    return (
        <div className={cn('rounded-lg border-2 overflow-hidden'
            , {
                'border-primary': border === 'primary',
                'border-secondary': border === 'secondary',
                'border-accent': border === 'accent',
                'border-base-100': border === 'base-100',
                'border-base-200': border === 'base-200',
                'border-base-300': border === 'base-300',
                'border-neutral': border === 'neutral',
            }
        )}>
            <div
                className={cn('flex items-center w-full p-4 text-xl border-b-2'
                    , {
                        'bg-primary text-primary-content': fill === 'primary',
                        'bg-secondary text-secondary-content': fill === 'secondary',
                        'bg-accent text-accent-content': fill === 'accent',
                        'bg-base-100 text-base-content': fill === 'base-100',
                        'bg-base-200 text-base-content': fill === 'base-200',
                        'bg-base-300 text-base-content': fill === 'base-300',
                        'bg-neutral text-neutral-content': fill === 'neutral',
                    },
                    {
                        'border-primary': border === 'primary',
                        'border-secondary': border === 'secondary',
                        'border-accent': border === 'accent',
                        'border-base-100': border === 'base-100',
                        'border-base-200': border === 'base-200',
                        'border-base-300': border === 'base-300',
                        'border-neutral': border === 'neutral',
                    }
                )}>
                {
                    Icon &&
                    <div className={'mr-4'}>
                        <Icon/>
                    </div>
                }
                {title}
            </div>
            {children}
        </div>
    )
}


export default TitleContainer;