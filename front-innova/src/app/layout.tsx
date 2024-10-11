import { Provider as ProviderMui } from "@/store/Mui/Provider";
import { Provider } from "@/store/NextAuth/provider";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Front-innova",
  description: "Front-innova",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${roboto.variable} w-screen h-screen`}
        suppressHydrationWarning
      >
        <ProviderMui>
          <Provider>{children}</Provider>
        </ProviderMui>
      </body>
    </html>
  );
}
