import "./globals.css";
import type { Metadata } from "next";
import { Inter, Google_Sans, Onest } from "next/font/google";
import SiteMenu from "@/components/SiteMenu/SiteMenu";
import { LenisWrapper } from "@/components/LenisWrapper";

const inter = Inter({ subsets: ["latin"] });

const googleSans = Google_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-google-sans",
});

const onest = Onest({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-onest",
});

export const metadata: Metadata = {
  title: "Replicating Animations",
  description: "Built by @Temitayo-spec",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${googleSans.variable} ${onest.variable}`}
      >
        <LenisWrapper>{children}</LenisWrapper>
        <SiteMenu />
      </body>
    </html>
  );
}
