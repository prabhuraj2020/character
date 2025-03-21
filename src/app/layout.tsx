import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { FavoritesProvider } from "@/context/FavoritesContext";
import "./globals.css";

// Import Noto Sans font
const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Star Wars Universe",
  description: "Explore the Star Wars universe with SWAPI.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={notoSans.variable}>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </body>
    </html>
  );
}
