import { Button } from "@web/components/ui/button";

interface BackgroundSectionProps {
  id?: string;
  image?: string;
  title?: string;
  description?: string;
  cta?: { label: string; href: string };
}

export function BackgroundSection({
  id,
  image = "/cr-2.jpg",
  title = "Türkiye'nin en büyük öğrenci turnuvasına katıl",
  description = "Rekabeti sahaya taşı, yeteneğini göster ve ödüller için savaş. Katılmak için hemen başvur!",
  cta = { label: "KAYIT OL", href: "#basvuru" },
}: BackgroundSectionProps) {
  return (
    <section id={id} className="relative py-24 min-h-[22rem]">
      {/* Background image with overlay */}
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(3,7,18,0.2), rgba(3,7,18,0.2)), url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <div className="rounded-3xl border border-white/15 bg-black/5 p-10 shadow-2xl shadow-black/30 backdrop-blur-md">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-lg text-white/85">
              {description}
            </p>

            {cta ? (
              <div className="mt-8">
                <Button asChild className="rounded-xl bg-white px-8 py-6 text-lg font-bold text-gray-900 hover:bg-slate-100">
                  <a href={cta.href}>{cta.label}</a>
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
