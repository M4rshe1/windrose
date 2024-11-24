"use client"
import {themeChange} from 'theme-change'
import {useEffect} from 'react'
import {Theme} from '@/lib/theme'


const ThemeButton = ({theme}: { theme: Theme }) => {
    useEffect(() => {
        themeChange(false)
    }, [])

    function changeTheme() {
        localStorage.setItem('theme', theme.key)
    }

    return (
        <button
            onClick={changeTheme}
            data-set-theme={theme.key}
            className="border-base-content/20 hover:border-base-content/40 overflow-hidden rounded-lg border"
            data-theme={theme.key} data-act-class="[&_svg]:visible">
            <div data-theme={theme.key} data-act-class="visible" className="bg-base-100 text-base-content w-full cursor-pointer font-sans">
                <div className="grid grid-cols-5 grid-rows-3">
                    <div className="bg-base-200 col-start-1 row-span-2 row-start-1 grid place-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                             fill="currentColor"
                             className="invisible h-3 w-3 shrink-0">
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                        </svg>
                    </div>
                    <div className="bg-base-300 col-start-1 row-start-3"></div>
                    <div className="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2">
                        <div className="font-bold w-full flex">{theme.name}</div>
                        <div className="flex flex-wrap gap-1">
                            <div
                                className="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                                <div className="text-primary-content text-sm font-bold">A</div>
                            </div>
                            <div
                                className="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                                <div className="text-secondary-content text-sm font-bold">A</div>
                            </div>
                            <div
                                className="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                                <div className="text-accent-content text-sm font-bold">A</div>
                            </div>
                            <div
                                className="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                                <div className="text-neutral-content text-sm font-bold">A</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </button>
    )
}

export default ThemeButton;