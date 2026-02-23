import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
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
  verification: {
    google: "Ihz5Cd5vkNkVuh36pZjbyhECtbKBY5oZu7pMs4t5kXU",
    yandex: "1a9f2e6da69db212",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${minecraftFont.variable} antialiased font-minecraft`}>
        {/* 2. ДОБАВЛЯЕМ ЯНДЕКС МЕТРИКУ (Скрипт) */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=106970586', 'ym');

            ym(106970586, 'init', {
                ssr:true, 
                webvisor:true, 
                clickmap:true, 
                ecommerce:"dataLayer", 
                referrer: document.referrer, 
                url: location.href, 
                accurateTrackBounce:true, 
                trackLinks:true
            });
          `}
        </Script>

        {/* 3. ДОБАВЛЯЕМ NOSCRIPT (Для пользователей без JS) */}
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/106970586"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>

        {/* Твой основной контент (page.tsx) */}
        {children}
      </body>
    </html>
  );
}
