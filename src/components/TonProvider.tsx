"use client";
import { TonConnectUIProvider } from '@tonconnect/ui-react';

export default function TonConnectProvider({
    children,
}: {
    children: React.ReactNode;
}) {

    const manifestUrl = "https://tma-ecommerce.vercel.app/tonconnect-manifest.json";

    return (
        <TonConnectUIProvider
            manifestUrl={manifestUrl}
            actionsConfiguration={{
                twaReturnUrl: "https://t.me/dragon_king_bot/drago",
            }}
        >
            {children}
        </TonConnectUIProvider>
    );
}