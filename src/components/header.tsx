'use client'

import dynamic from "next/dynamic";
import ThemeSwitcher from "./themeSwitcher";
import Link from 'next/link'

const WalletMultiButtonDynamic = dynamic(
    async () =>
        (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
);

const Header = () => {
    return (
        <header className="w-full"
        >
            <div className="max-w-5xl mx-auto px-4 py-12 md:py-10 flex items-center justify-between"
            >
                <Link href="/">
                    <h1 className="text-3xl font-light text-muted-foreground">
                        FatCat
                    </h1>
                </Link>
                <div className="flex items-center gap-4">
                    <WalletMultiButtonDynamic />
                    <ThemeSwitcher />
                </div>
            </div>
        </header>
    );
};

export default Header;

