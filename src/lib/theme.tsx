"use client"

import React, { useEffect, useState } from 'react';

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<string>("dark");

    useEffect(() => {
        const savedTheme = typeof window !== 'undefined'
            ? localStorage.getItem("theme")
            : "dark"
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    return (
        <html lang="en" data-theme={theme}>
        {children}
        </html>
    );
};

export default ThemeProvider;