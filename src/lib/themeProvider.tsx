import React from 'react';
import {cookies} from "next/headers";


const ThemeProvider = async ({children}: { children: React.ReactNode }) => {
    const cookieStore = await cookies()
    const theme = cookieStore.get('theme')

    return (
        <html lang="en" data-theme={theme?.value || 'dark'}>
        {children}
        </html>
    );
};

export default ThemeProvider;