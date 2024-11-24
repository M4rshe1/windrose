import {BreadcrumbPortal} from "@/components/breadcrumbBar";
import H1 from "@/components/ui/h1";
import {themes} from "@/lib/theme";
import ThemeButton from "@/components/themeButton";
import {cn} from "@/lib/utils";

const AppearanceSettings = async () => {
    return (
        <>
            <BreadcrumbPortal items={
                [
                    {
                        title: 'Settings', url: '/settings'
                    },
                    {
                        title: 'Appearance', url: '/settings/appearance'
                    }
                ]
            }/>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <H1
                >Appearance</H1>
                <div className={cn('rounded-lg border-2 border-accent overflow-hidden')}>
                    <div className={cn('flex items-center w-full p-4 text-xl border-b-2 border-accent bg-accent text-accent-content')}>Theme</div>
                <div className={cn('p-4 rounded-box grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5')}>

                {
                    themes.map((theme, key) => (
                        <ThemeButton key={key} theme={theme}/>
                    ))
                }
                </div>
                </div>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"/>
            </div>
        </>
    );
}

export default AppearanceSettings;