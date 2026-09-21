import { useState, useEffect, useRef } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { toast } from "sonner";
import { PaymentReassurance } from "@/components/PaymentReassurance";
import { CHECKOUT_URL, PRICE_XOF, PRICE_STRIKE_XOF } from "@/lib/offer";
import { trackEvent } from "@/lib/analytics";

export interface LeadFormData {
  firstName: string;
  email: string;
  whatsapp: string;
  country: string;
}

interface LeadCaptureModalProps {
  onClose: () => void;
  onSubmit: () => void;
}

// Validation schema (mirrored server-side in the submit-lead edge function)
const leadSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "Le prénom est requis")
    .max(100, "Le prénom ne peut pas dépasser 100 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le prénom ne peut contenir que des lettres"),
  email: z
    .string()
    .trim()
    .email("Format d'email invalide")
    .max(255, "L'email ne peut pas dépasser 255 caractères"),
  whatsapp: z
    .string()
    .min(10, "Le numéro WhatsApp doit contenir au moins 10 chiffres")
    .max(20, "Le numéro WhatsApp ne peut pas dépasser 20 caractères"),
  country: z.string().min(1, "Le pays est requis"),
});

type FieldErrors = Partial<Record<"firstName" | "email" | "whatsapp" | "country", string>>;

const countryNames =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["fr"], { type: "region" })
    : null;

const countryNameFromIso = (iso2?: string) => {
  if (!iso2) return "";
  const upper = iso2.toUpperCase();
  try {
    return countryNames?.of(upper) ?? upper;
  } catch {
    return upper;
  }
};

export const LeadCaptureModal = ({ onClose, onSubmit }: LeadCaptureModalProps) => {
  const [formData, setFormData] = useState({ firstName: "", email: "" });
  const [phone, setPhone] = useState("");
  const [countryIso, setCountryIso] = useState("ci");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    // Simple focus trap: keep Tab focus inside the modal
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !modalRef.current) return;
      const focusables = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleTab);
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleTab);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = leadSchema.safeParse({
      firstName: formData.firstName,
      email: formData.email,
      whatsapp: phone,
      country: countryNameFromIso(countryIso),
    });

    if (!validationResult.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of validationResult.error.errors) {
        const key = issue.path[0] as keyof FieldErrors;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("submit-lead", {
        body: validationResult.data,
      });

      if (error) throw error;

      if (data?.alreadyRegistered) {
        toast.info("Cet email est déjà inscrit — tu recevras à nouveau les ressources.");
      }

      localStorage.setItem("kpb_lead_status", "submitted");
      setSucceeded(true);
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-dark/80 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={succeeded ? onSubmit : onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-card rounded-2xl shadow-cta animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={succeeded ? onSubmit : onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
          aria-label="Fermer la fenêtre"
        >
          <X className="w-5 h-5" />
        </button>

        {succeeded ? (
          <div className="p-6 md:p-8 text-center">
            <CheckCircle2 className="w-14 h-14 text-gold mx-auto mb-3" aria-hidden="true" />
            <h2 id="lead-modal-title" className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              C'est confirmé, {formData.firstName} ! 🎉
            </h2>
            <p className="text-muted-foreground mb-5">
              Tu vas recevoir ton accès au webinaire et le Guide des 10 Bourses par email et sur
              WhatsApp. Pense à vérifier tes spams.
            </p>

            <div className="rounded-2xl border-2 border-gold bg-muted p-5 mb-5 text-left">
              <p className="text-sm font-bold text-destructive mb-2">
                ⚡ Offre réservée aux inscrits
              </p>
              <p className="font-bold text-foreground mb-1">Le Guide Ultime du Boursier Africain</p>
              <p className="text-sm text-muted-foreground mb-3">
                Le système complet (FR/EN) : guide PDF, tableur de 30 bourses 2026-2027, modèles de
                CV, lettres de motivation et de recommandation.
              </p>
              <p className="mb-4">
                <span className="text-muted-foreground line-through mr-2">{PRICE_STRIKE_XOF}</span>
                <span className="text-3xl font-black text-gold">{PRICE_XOF}</span>
              </p>
              <Button
                asChild
                className="w-full h-auto min-h-14 py-3 text-base font-bold whitespace-normal bg-gold hover:bg-gold-light text-blue-dark shadow-cta"
              >
                <a
                  href={CHECKOUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("checkout_click", { location: "lead_confirmation" })}
                >
                  Obtenir le Guide maintenant 🚀
                </a>
              </Button>
              <PaymentReassurance compact />
            </div>

            <button
              type="button"
              onClick={onSubmit}
              className="text-primary font-semibold underline underline-offset-4 hover:text-gold transition-colors"
            >
              Regarder le webinaire maintenant ▶️
            </button>
          </div>
        ) : (
          <div className="p-6 md:p-8">
            <div className="text-center mb-6">
              <h2 id="lead-modal-title" className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Remplis le formulaire pour obtenir ton accès au Webinaire Gratuit !
              </h2>
              <p className="text-muted-foreground">
                Nous t'enverrons aussi le Guide des 10 Bourses à ne pas râter en 2026 !
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <Label htmlFor="firstName" className="text-foreground font-semibold">
                  Prénom <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  ref={firstFieldRef}
                  type="text"
                  autoComplete="given-name"
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="mt-1.5 h-12 border-2 focus:border-gold"
                  placeholder="Ton prénom"
                />
                {errors.firstName && (
                  <p id="firstName-error" className="text-sm text-destructive mt-1.5">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-foreground font-semibold">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1.5 h-12 border-2 focus:border-gold"
                  placeholder="exemple@email.com"
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-destructive mt-1.5">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="whatsapp" className="text-foreground font-semibold">
                  WhatsApp <span className="text-destructive">*</span>
                </Label>
                <div className="mt-1.5">
                  <PhoneInput
                    inputProps={{ id: "whatsapp" }}
                    defaultCountry="ci"
                    value={phone}
                    onChange={(value, meta) => {
                      setPhone(value);
                      if (meta?.country?.iso2) setCountryIso(meta.country.iso2);
                    }}
                    inputClassName="h-12"
                    className="phone-input-custom"
                  />
                </div>
                {errors.whatsapp && (
                  <p className="text-sm text-destructive mt-1.5">{errors.whatsapp}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1.5">
                  Pays détecté : <span className="font-semibold">{countryNameFromIso(countryIso)}</span>
                </p>
              </div>

              <p className="text-xs text-muted-foreground text-center py-2">
                🔒 Tes informations sont confidentielles. Tu peux te désinscrire à tout moment.
              </p>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 text-lg font-bold bg-gold hover:bg-gold-light text-blue-dark shadow-cta transition-all disabled:opacity-50"
                aria-label="Obtenir les ressources gratuites"
              >
                {isSubmitting ? "Envoi en cours..." : "Je veux les ressources 🎁"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
