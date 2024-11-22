import { ThemeProviderWrapper } from "../providers/themeProvider";
import { WalletAdapterProvider } from "../providers/walletAdapterProvider";
import type { Metadata } from "next";
import "./globals.css";
import { UmiProvider } from "../providers/umiProvider";
import { cn } from "../lib/utils";
import {PersistentWarning} from "../components/persistent-warning";
import { GeistSans } from 'geist/font/sans';


export const metadata: Metadata = {
    title: "FatCat",
    description: "Jupiter Governance Vote Automation.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <link rel="icon" href="/favicon.ico" />
        </head>
        <body
            className={cn(
                GeistSans.className,
                "min-h-screen bg-background antialiased"
            )}
        >
        <WalletAdapterProvider>
            <UmiProvider>
                <ThemeProviderWrapper
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <PersistentWarning />
                </ThemeProviderWrapper>
            </UmiProvider>
        </WalletAdapterProvider>
        </body>
        </html>
    );
}

