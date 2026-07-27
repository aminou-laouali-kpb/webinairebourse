import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LeadCaptureModal } from "@/components/LeadCaptureModal";
import { FAQSection } from "@/components/FAQSection";
import { Testimonials } from "@/components/Testimonials";
import { WhoIsFor } from "@/components/WhoIsFor";
import { CountdownTimer } from "@/components/CountdownTimer";
import { YouTubeFacade } from "@/components/YouTubeFacade";
import { CheckCircle2, Award, Users, TrendingUp, ExternalLink, ShieldCheck, Gift } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import guideImage from "@/assets/guide-ultime.png";

const CONFIG = {
  youtubeId: "txFGmhZhpv4",
  guideImageUrl: guideImage,
  checkoutUrl:
    "https://kpb-education.maketou.com/products/le-guide-ultime-du-boursier-africain/checkout?utm_source=webinaire&utm_medium=miniapp&utm_campaign=guide_ultime",
};

const LEAD_STATUS_KEY = "kpb_lead_status";

const Index = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const autoOpenDone = useRef(false);

  const openModal = useCallback((source: string) => {
    setShowModal(true);
    trackEvent("modal_open", { source });
  }, []);

  const scrollToVideo = () => {
    document.getElementById("webinaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    trackEvent("page_view", { path: window.location.pathname });
  }, []);


  // Auto-open once: after 25s or at 30% scroll, whichever comes first
  useEffect(() => {
    if (localStorage.getItem(LEAD_STATUS_KEY)) return;

    const trigger = (source: string) => () => {
      if (autoOpenDone.current) return;
      autoOpenDone.current = true;
      setShowModal(true);
      trackEvent("modal_open", { source });
    };


    const timer = setTimeout(trigger, 25000);
    const onScroll = () => {
      const progress = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
      if (progress > 0.3) trigger();
    };
    const onExitIntent = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onExitIntent);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onExitIntent);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleModalClose = () => {
    setShowModal(false);
    if (localStorage.getItem(LEAD_STATUS_KEY) !== "submitted") {
      localStorage.setItem(LEAD_STATUS_KEY, "closed");
    }
  };

  const handleLeadSubmit = () => {
    setShowModal(false);
    setShowConfirmation(true);
    scrollToVideo();
    setTimeout(() => setShowConfirmation(false), 10000);
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary via-blue-dark to-primary text-primary-foreground py-3 text-center">
        <p className="text-sm md:text-base font-semibold px-4">
          🎓 Webinaire Gratuit • Bourses d'études 2025–2026
        </p>
      </div>

      {/* Hero Section */}
      <section className="container max-w-5xl mx-auto px-4 py-8 md:py-12 text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-4">
          <span className="block">Comment j'ai obtenu une bourse internationale…</span>
          <span className="block text-primary">et comment toi aussi tu peux le faire</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Masterclass 100 % gratuite pour t'aider à comprendre comment candidater malin, même si tu pars de zéro.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={scrollToVideo}
            size="lg"
            className="h-14 px-8 text-lg font-bold bg-gold hover:bg-gold-light text-blue-dark shadow-cta hover:scale-105 transition-all"
          >
            ▶️ Regarder le webinaire
          </Button>
          <Button
            onClick={() => openModal("hero")}
            variant="outline"
            size="lg"
            className="h-14 px-8 text-lg font-bold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
          >
            Recevoir les ressources gratuites
          </Button>
        </div>
      </section>

      {/* Video Section */}
      <section id="webinaire" className="container max-w-4xl mx-auto px-4 mb-12 scroll-mt-4">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-cta bg-accent aspect-video">
          <YouTubeFacade
            videoId={CONFIG.youtubeId}
            title="Webinaire KPB Education — Bourses d'études internationales"
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

        {showConfirmation && (
          <div className="mt-6 p-4 bg-green-50 border-2 border-green-500 rounded-xl text-center animate-in fade-in slide-in-from-top duration-500">
            <p className="text-green-700 font-semibold">
              ✅ Merci ! Tu recevras les ressources dans ta boîte email et sur WhatsApp.
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => openModal("under_video")}
            className="inline-flex items-center gap-2 text-primary font-semibold underline underline-offset-4 hover:text-gold transition-colors"
          >
            <Gift className="w-4 h-4" aria-hidden="true" />
            Recevoir le Guide des 10 Bourses 2026 (gratuit)
          </button>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="bg-muted py-12 md:py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-10">
            Dans ce webinaire, tu vas découvrir :
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
        </div>
      </section>

      {/* Who is it for */}
      <WhoIsFor />

      {/* Guide Offer Section */}
      <section className="container max-w-5xl mx-auto px-4 py-12 md:py-20">
        <div className="bg-gradient-to-br from-card to-muted border-4 border-gold rounded-3xl shadow-cta p-6 md:p-10">
          <div className="text-center mb-6">
            <span className="inline-block px-5 py-2 bg-gold text-blue-dark font-bold rounded-full text-sm mb-4">
              Pour aller plus loin après le webinaire
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

            <div className="order-1 md:order-2 space-y-5">
              <h3 className="text-xl font-bold text-foreground mb-4">Ce qui est inclus :</h3>
              {[
                "📘 Guide PDF pas-à-pas (FR/EN)",
                "📊 Tableur 30 bourses 2025–2026 (Licence, Master, Doctorat)",
                "📝 5 modèles de CV + 5 lettres de motivation FR/EN",
                "✉️ 4 lettres de recommandation FR/EN",
                "✅ Checklists + mini-guide pour améliorer ton anglais",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gold rounded-full flex-shrink-0" />
                  <p className="text-foreground font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 md:p-8 text-center border-2 border-border">
            <div className="mb-5">
              <p className="text-muted-foreground line-through text-xl mb-2">14 999 XOF</p>
              <p className="text-5xl md:text-6xl font-black text-gold mb-2">4 999 XOF</p>
              <p className="text-sm text-destructive font-semibold mb-4">
                ⚡ Offre spéciale participants au webinaire — se termine dans :
              </p>
              <CountdownTimer />
            </div>

            <Button
              asChild
              className="w-full md:w-auto px-12 h-16 text-xl font-bold bg-gold hover:bg-gold-light text-blue-dark shadow-cta hover:shadow-cta hover:scale-105 transition-all"
            >
              <a
                href={CONFIG.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Obtenir le Guide Ultime du Boursier Africain pour 4999 XOF"
              >
                Obtenir le Guide maintenant 🚀
              </a>
            </Button>

            <div className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="w-5 h-5 text-gold" aria-hidden="true" />
              <span>Paiement sécurisé • Accès immédiat après paiement</span>
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
            Rejoins les centaines d'étudiants qui ont transformé leur candidature avec le Guide Ultime.
          </p>
          <Button
            asChild
            size="lg"
            className="px-12 h-16 text-xl font-bold bg-blue-dark hover:bg-blue-royal text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <a href={CONFIG.checkoutUrl} target="_blank" rel="noopener noreferrer">
              Obtenir mon guide maintenant
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
            onClick={() => openModal("footer")}
            className="text-gold font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity mb-4"
          >
            Recevoir le Guide gratuit des 10 Bourses 2026
          </button>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-accent-foreground/70">
            <Link to="/confidentialite" className="hover:text-gold transition-colors">
              Politique de confidentialité
            </Link>
            <span>•</span>
            <p>Tu peux te désinscrire à tout moment de nos emails/WhatsApp.</p>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom Bar */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-dark text-primary-foreground shadow-sticky p-3 md:py-2 z-40 animate-in slide-in-from-bottom duration-300">
          <div className="container max-w-4xl mx-auto flex items-center justify-between gap-3">
            <div className="text-left">
              <p className="text-xs font-medium opacity-90">
                Le Guide Ultime • fin de l'offre dans <CountdownTimer variant="compact" />
              </p>
              <p className="text-lg font-black text-gold leading-tight">
                4 999 XOF <span className="text-xs font-normal line-through opacity-60">14 999</span>
              </p>
            </div>
            <Button
              asChild
              className="bg-gold hover:bg-gold-light text-blue-dark font-bold shadow-cta whitespace-nowrap"
            >
              <a href={CONFIG.checkoutUrl} target="_blank" rel="noopener noreferrer">
                Acheter maintenant
              </a>
            </Button>
          </div>
        </div>
      )}

      {/* Lead Capture Modal */}
      {showModal && <LeadCaptureModal onClose={handleModalClose} onSubmit={handleLeadSubmit} />}
    </div>
  );
};

export default Index;
