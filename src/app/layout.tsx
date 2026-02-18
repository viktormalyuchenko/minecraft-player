import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Подключение локального шрифта
const minecraftFont = localFont({
  src: "./fonts/Minecraft.ttf", // Убедись, что имя файла совпадает!
  variable: "--font-minecraft", // CSS переменная, чтобы юзать в Tailwind
  display: "swap",
});

// Глобальное SEO для всего сайта
export const metadata: Metadata = {
  title:
    "Музыка из Майнкрафта — Слушать музыку из Майнкрафта бесплатно (Minecraft OST)",
  description:
    "Слушайте полную коллекцию музыки из Minecraft (C418, Lena Raine) онлайн бесплатно. Атмосферный плеер с фонами из игры.",
  keywords: [
    "майнкрафт музыка",
    "minecraft ost",
    "c418",
    "sweden",
    "слушать онлайн",
    "саундтрек майнкрафт",
  ],
  openGraph: {
    title: "Музыка из Майнкрафта — Атмосферный плеер",
    description: "Любимые треки C418 и Lena Raine с живыми обоями из игры.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${minecraftFont.variable} font-minecraft antialiased`}>
        {children}
      </body>
    </html>
  );
}
