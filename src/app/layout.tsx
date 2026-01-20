import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import LiveChatButton from "@/components/LiveChatButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Udreamms | Tu Sueño en USA",
  description: "Asesoría experta para visas, estudios y nueva vida en Estados Unidos. Tecnología y soporte humano en un solo lugar.",
  icons: {
    icon: "/assets/Logo Udreamms.png",
    apple: "/assets/Logo Udreamms.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
          {children}
          <LiveChatButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
