import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import StoreProvider from "@/app/StoreProvider";
import CartSync from "@/components/CartSync";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    title: "Go-shop - Le marche en ligne du Benin",
    description: "Go-shop - Achetez local, simple et malin au Benin",
};

export default function RootLayout({ children }) {
    return (
        <html lang="fr">
            <body className={`${outfit.className} antialiased`}>
                <SessionProvider>
                    <StoreProvider>
                        <Toaster />
                        <CartSync />
                        {children}
                    </StoreProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
