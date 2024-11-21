import { ThemeProviderWrapper } from "../providers/themeProvider";
import { WalletAdapterProvider } from "../providers/walletAdapterProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UmiProvider } from "../providers/umiProvider";
import { cn } from "../lib/utils";
import {PersistentWarning} from "../components/persistent-warning";

const inter = Inter({ subsets: ["latin"] });

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
                inter.className,
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

