import {BreadcrumbPortal} from "@/components/breadcrumbBar";
import H1 from "@/components/ui/h1";
import {Theme, themes} from "@/lib/theme";
import ThemeButton from "@/components/themeButton";
import {cn} from "@/lib/utils";
import {Brush, LucideIcon} from "lucide-react";
import {TablerIcon} from "@tabler/icons-react";
import TitleContainer from "@/components/titleContainer";

const AppearanceSettings = async () => {
    const sortedThemes = themes.sort((a, b) => a.dark === b.dark ? 0 : a.dark ? -1 : 1);
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
            <div className="flex flex-1 flex-col gap-4 p-4 lg:max-w-screen-lg max-w-lg w-full mx-auto ">
                <div className={cn(`flex flex-col gap-2 w-full`)}>
                    <H1>Appearance</H1>
                    <ThemeContainer themes={sortedThemes} title={'Theme'} Icon={Brush}/>
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"/>
                </div>
            </div>
        </>
    );
}

const ThemeContainer = ({themes, title, Icon}: { themes: Theme[], title: string, Icon: LucideIcon | TablerIcon }) => {
    return (
        <TitleContainer title={title} Icon={Icon} fill={'neutral'} border={'base-200'}>
            <div
                className={cn('p-4 rounded-box grid grid-cols-2 gap-4 lg:grid-cols-3')}>

                {
                    themes.map((theme, key) => (
                        <ThemeButton key={key} theme={theme}/>
                    ))
                }
            </div>
        </TitleContainer>
    )
}

export default AppearanceSettings;