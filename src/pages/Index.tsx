import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FAQSection } from "@/components/FAQSection";
import { Testimonials } from "@/components/Testimonials";
import { WhoIsFor } from "@/components/WhoIsFor";
import { CountdownTimer } from "@/components/CountdownTimer";
import { YouTubeFacade } from "@/components/YouTubeFacade";
import { CheckCircle2, Award, Users, TrendingUp, ExternalLink, ShieldCheck } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { PaymentReassurance } from "@/components/PaymentReassurance";
import { CHECKOUT_URL, PRICE_XOF, PRICE_STRIKE_XOF } from "@/lib/offer";
import guideImage from "@/assets/guide-ultime.png";

const CONFIG = {
  youtubeId: "txFGmhZhpv4",
  guideImageUrl: guideImage,
  checkoutUrl: CHECKOUT_URL,
};

const INCLUDED_ITEMS = [
  { label: "📘 Guide PDF pas-à-pas (FR/EN)", value: "12 000 XOF" },
  { label: "📊 Tableur 30 bourses 2026-2027", value: "9 000 XOF" },
  { label: "📝 5 modèles de CV + 5 lettres de motivation FR/EN", value: "8 000 XOF" },
  { label: "✉️ 4 lettres de recommandation FR/EN", value: "5 000 XOF" },
  { label: "✅ Checklists + mini-guide anglais", value: "4 000 XOF" },
];

/** Bouton d'achat unique — toutes les variantes mènent au même lien de paiement. */
const BuyButton = ({
  location,
  label = "Obtenir le Guide maintenant 🚀",
  className = "",
}: {
  location: string;
  label?: string;
  className?: string;
}) => (
  <Button
    asChild
    className={`w-full md:w-auto px-4 md:px-12 h-auto min-h-16 py-4 text-lg md:text-xl font-bold whitespace-normal bg-gold hover:bg-gold-light text-blue-dark shadow-cta md:hover:scale-105 transition-all ${className}`}
  >
    <a
      href={CONFIG.checkoutUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("checkout_click", { location })}
      aria-label={`Obtenir le Guide Ultime du Boursier Africain pour ${PRICE_XOF}`}
    >
      {label}
    </a>
  </Button>
);

const Index = () => {
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    trackEvent("page_view", { path: window.location.pathname });
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToOffer = () => {
    document.getElementById("offre")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary via-blue-dark to-primary text-primary-foreground py-3 text-center">
        <p className="text-sm md:text-base font-semibold px-4">
          🎓 Bourses d'études 2026-2027 • Accès immédiat après paiement
        </p>
      </div>

      {/* Hero Section */}
      <section className="container max-w-5xl mx-auto px-4 py-8 md:py-12 text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-4">
          <span className="block">Décroche une bourse d'études 2026-2027</span>
          <span className="block text-primary">avec la méthode complète, étape par étape</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
          Le Guide Ultime du Boursier Africain : le système exact (FR/EN) pour monter un dossier
          solide, sans intermédiaire et sans payer un agent.
        </p>
        <p className="text-2xl md:text-3xl font-black text-gold mb-6">
          {PRICE_XOF}{" "}
          <span className="text-base md:text-lg font-normal text-muted-foreground line-through">
            {PRICE_STRIKE_XOF}
          </span>
        </p>
        <div className="flex justify-center">
          <BuyButton location="hero" label={`Obtenir le Guide — ${PRICE_XOF}`} />
        </div>
        <PaymentReassurance />
      </section>

      {/* Video Section */}
      <section id="video" className="container max-w-4xl mx-auto px-4 mb-12 scroll-mt-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-5">
          Regarde ce que contient le Guide (3 min)
        </h2>
        <div className="relative w-full rounded-2xl overflow-hidden shadow-cta bg-accent aspect-video">
          <YouTubeFacade
            videoId={CONFIG.youtubeId}
            title="Le Guide Ultime du Boursier Africain — présentation"
            onPlay={() => trackEvent("video_play")}
          />
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Si la vidéo ne s'affiche pas,{" "}
          <a
            href={`https://www.youtube.com/watch?v=${CONFIG.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-gold underline inline-flex items-center gap-1"
          >
            clique ici pour l'ouvrir sur YouTube
            <ExternalLink className="w-3 h-3" />
          </a>
        </p>

        <div className="mt-6 flex flex-col items-center gap-3">
          <BuyButton location="under_video" label={`Je veux le Guide — ${PRICE_XOF}`} />
          <PaymentReassurance compact />
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="bg-muted py-12 md:py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-10">
            Dans le Guide, tu vas apprendre :
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            {[
              "Pourquoi la plupart des étudiants échouent avant même de postuler",
              "Comment choisir les bourses qui correspondent vraiment à ton profil",
              "La structure d'une lettre de motivation qui impressionne un jury",
              "Le système exact que j'ai utilisé pour décrocher ma bourse Chevening",
              "Les erreurs fatales à éviter dans ton dossier",
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 bg-card p-5 rounded-xl shadow-card">
                <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                <p className="text-foreground font-medium leading-relaxed">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            <BuyButton location="after_benefits" label={`Obtenir le Guide — ${PRICE_XOF}`} />
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <WhoIsFor />

      {/* Guide Offer Section */}
      <section id="offre" className="container max-w-5xl mx-auto px-4 py-12 md:py-20 scroll-mt-4">
        <div className="bg-gradient-to-br from-card to-muted border-4 border-gold rounded-3xl shadow-cta p-6 md:p-10">
          <div className="text-center mb-6">
            <span className="inline-block px-5 py-2 bg-gold text-blue-dark font-bold rounded-full text-sm mb-4">
              Tout ce que tu reçois aujourd'hui
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-3">
              <span className="block">Le Guide Ultime du</span>
              <span className="block">Boursier Africain</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Le système complet (FR/EN) pour transformer ton profil en dossier solide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
            <div className="order-2 md:order-1">
              <img
                src={CONFIG.guideImageUrl}
                alt="Le Guide Ultime du Boursier Africain"
                loading="lazy"
                className="w-full max-w-sm mx-auto rounded-2xl shadow-cta"
              />
            </div>

            <div className="order-1 md:order-2">
              <h3 className="text-xl font-bold text-foreground mb-4">Ce qui est inclus :</h3>
              <ul className="space-y-3">
                {INCLUDED_ITEMS.map((item) => (
                  <li key={item.label} className="flex items-start justify-between gap-3">
                    <span className="flex items-start gap-3 text-foreground font-medium">
                      <span className="w-2 h-2 bg-gold rounded-full flex-shrink-0 mt-2" />
                      {item.label}
                    </span>
                    <span className="text-sm text-muted-foreground line-through whitespace-nowrap flex-shrink-0">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-4 border-t-2 border-gold/40 flex items-center justify-between gap-3">
                <span className="font-bold text-foreground">Valeur totale</span>
                <span className="font-black text-foreground line-through">38 000 XOF</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 md:p-8 text-center border-2 border-border">
            <div className="mb-5">
              <p className="text-muted-foreground line-through text-xl mb-2">{PRICE_STRIKE_XOF}</p>
              <p className="text-5xl md:text-6xl font-black text-gold mb-2">{PRICE_XOF}</p>
              <p className="text-sm text-destructive font-semibold mb-4">
                ⚡ Prix de lancement — se termine dans :
              </p>
              <CountdownTimer />
            </div>

            <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-5">
              Une seule candidature ratée te coûte une année entière. Le guide coûte moins qu'un
              forfait internet mensuel.
            </p>

            <div className="bg-muted rounded-xl p-4 mb-5 text-sm text-foreground font-medium">
              ⏱️ Ce que tu obtiens dans les 2 minutes : le guide PDF, le tableur des bourses et tous
              les modèles, envoyés par email et WhatsApp.
            </div>

            <BuyButton location="offer" />

            <PaymentReassurance />

            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="w-5 h-5 text-gold" aria-hidden="true" />
              <span>Paiement sécurisé par MoneyFusion</span>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility Section */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Pourquoi tu peux me faire confiance
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: Award, text: "🎓 Boursier Chevening 2024" },
              { icon: Users, text: "▶️ 60 000 abonnés YouTube" },
              { icon: TrendingUp, text: "✅ 200+ lauréats accompagnés" },
            ].map((item, index) => (
              <div key={index} className="bg-primary-foreground/10 backdrop-blur rounded-xl p-6 text-center">
                <item.icon className="w-10 h-10 mx-auto mb-3 text-gold" />
                <p className="font-bold text-lg">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="bg-primary-foreground/10 backdrop-blur rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-bold mb-3">Qui suis-je ?</h3>
            <p className="text-primary-foreground/90 leading-relaxed">
              Je suis le fondateur de KPB Éducation. Parti d'un dossier refusé plusieurs fois, j'ai
              fini par décrocher la bourse Chevening en comprenant ce que les jurys attendent
              réellement. Depuis, je partage ce système avec des milliers d'étudiants africains sur
              YouTube et j'ai accompagné plus de 200 lauréats vers une bourse.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA */}
      <section className="container max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-gradient-to-br from-gold via-gold-light to-gold rounded-3xl p-8 md:p-12 shadow-cta">
          <h2 className="text-3xl md:text-4xl font-black text-blue-dark mb-4">
            Prêt à passer à l'action ?
          </h2>
          <p className="text-blue-dark/80 text-lg mb-8 max-w-2xl mx-auto">
            Rejoins les centaines d'étudiants qui ont transformé leur candidature avec le Guide
            Ultime. Accès immédiat, garanti 7 jours.
          </p>
          <Button
            asChild
            size="lg"
            className="w-full md:w-auto px-4 md:px-12 h-auto min-h-16 py-4 text-lg md:text-xl font-bold whitespace-normal bg-blue-dark hover:bg-blue-royal text-primary-foreground shadow-lg hover:shadow-xl md:hover:scale-105 transition-all"
          >
            <a
              href={CONFIG.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("checkout_click", { location: "final_cta" })}
            >
              Obtenir mon guide — {PRICE_XOF}
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-accent text-accent-foreground py-8">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <p className="font-semibold mb-3">KPB Éducation — Tous droits réservés.</p>
          <button
            type="button"
            onClick={scrollToOffer}
            className="text-gold font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity mb-4"
          >
            Voir l'offre du Guide Ultime
          </button>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-accent-foreground/70">
            <Link to="/confidentialite" className="hover:text-gold transition-colors">
              Politique de confidentialité
            </Link>
            <span>•</span>
            <p>Paiement sécurisé • Satisfait ou remboursé sous 7 jours.</p>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom Bar */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-dark text-primary-foreground shadow-sticky px-3 py-2 z-40 animate-in slide-in-from-bottom duration-300">
          <div className="container max-w-4xl mx-auto px-0 flex items-center justify-between gap-2 sm:gap-3">
            <div className="text-left min-w-0 flex-1">
              <p className="text-[11px] sm:text-xs font-medium opacity-90 truncate">
                <span className="hidden sm:inline">Le Guide Ultime • fin de l'offre dans </span>
                <span className="sm:hidden">Fin dans </span>
                <CountdownTimer variant="compact" />
              </p>
              <p className="text-base sm:text-lg font-black text-gold leading-tight whitespace-nowrap">
                9 000 XOF{" "}
                <span className="text-[10px] sm:text-xs font-normal line-through opacity-60">
                  19 999
                </span>
              </p>
              <p className="hidden md:block text-[11px] opacity-80 truncate">
                Wave • Orange Money • MTN • Moov — garanti 7 jours
              </p>
            </div>
            <Button
              asChild
              className="bg-gold hover:bg-gold-light text-blue-dark font-bold shadow-cta whitespace-nowrap text-sm px-4 sm:text-base sm:px-6 flex-shrink-0"
            >
              <a
                href={CONFIG.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("checkout_click", { location: "sticky_bar" })}
              >
                Acheter maintenant
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
