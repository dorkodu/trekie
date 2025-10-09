import { IconBrandInstagram, IconBrandTelegram, IconBrandTwitter } from "@tabler/icons-react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Footer } from "@web/components/www/footer";
import { Header } from "@web/components/www/header";

export const Route = createFileRoute("/_www")({
  component: WebsiteLayout,
});

function WebsiteLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer
        copyright={`© Dorkodu, ${new Date().getFullYear()}`}
        legalLinks={[
          { name: "Terms of Service", href: "/legal/terms-of-service" },
          { name: "Privacy Policy", href: "/legal/privacy-policy" },
          { name: "Community Rules", href: "/legal/community-rules" },
          { name: "Cookie Policy", href: "/legal/cookie-policy" },
        ]}
        sections={[
          {
            title: "Turnuva",
            links: [
              { name: "Hakkında", href: "/#hakkinda" },
              { name: "Kurallar", href: "/#kurallar" },
              { name: "Takvim", href: "/#takvim" },
              { name: "Ödüller", href: "/#oduller" },
            ],
          },
          {
            title: "Organizasyon",
            links: [
              { name: "İstanbul Teknik Üniversitesi", href: "https://itu.edu.tr" },
              { name: "Bilgisayar Mühendisliği", href: "https://bm.itu.edu.tr" },
              { name: "Öğrenci Kulüpleri", href: "#" },
            ],
          },
        ]}
        description="Türkiye'nin en büyük üniversiteler arası mobil oyun turnuvası"
        logo={{
          src: "/images/trekie_Icon.svg",
          alt: "Uniturnuva Logo",
          title: "Uniturnuva",
          url: "/"
        }}
        socialLinks={[
          { icon: <IconBrandInstagram />, href: "https://instagram.com/uniturnuva", label: "Instagram" },
          { icon: <IconBrandTelegram />, href: "https://t.me/uniturnuva", label: "Telegram" },
          { icon: <IconBrandTwitter />, href: "https://twitter.com/uniturnuva", label: "Twitter" },
        ]}
      />
    </>
  );
}
