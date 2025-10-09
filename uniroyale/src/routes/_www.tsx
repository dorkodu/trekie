import { IconBrandInstagram, IconBrandTiktok } from "@tabler/icons-react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Footer } from "@web/components/www/footer";

export const Route = createFileRoute("/_www")({
  component: WebsiteLayout,
});

function WebsiteLayout() {
  return (
    <>
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
              { name: "AD432 Entrepreneurship Dersi Öğrencileri", href: "#" },
            ],
          },
        ]}
        description="Türkiye'nin en eğlenceli öğrenciler arası Clash Royale turnuvası."
        logo={{
          src: "/uniturnuva-logo.png",
          alt: "Uniturnuva Logo",
          title: "Uniturnuva",
          url: "/"
        }}
        socialLinks={[
          { icon: <IconBrandInstagram />, href: "https://instagram.com/uniturnuva_cr", label: "Instagram" },
          { icon: <IconBrandTiktok />, href: "https://www.tiktok.com/@uni.turnuva.cr", label: "TikTok" },
        ]}
      />
    </>
  );
}
