import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import React from "react";
import ThemeProvider from "@/lib/theme";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Windrose",
    description: "A platform to share your explorations.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ThemeProvider>
            <body
                className={`${inter.className}`}
            >
            <Header/>
            {children}
            <Footer/>
            </body>
        </ThemeProvider>
    );
}
