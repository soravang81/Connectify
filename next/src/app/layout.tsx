import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import ClientWrapper from "./wrapper";
import SocketListeners from "./socketListeners";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Connectify",
  description: "A Whatsapp like ChatApp",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  // console.log("main rerender")
  return (
    <html lang="en"  suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
        <ClientWrapper>
          <SocketListeners>
            {children}
          </SocketListeners>
          </ClientWrapper>
        </Providers>
      </body>
    </html>
  );
}