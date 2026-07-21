import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { toast } from "sonner";

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

const africanCountries = [
  "Algérie", "Angola", "Bénin", "Botswana", "Burkina Faso", "Burundi",
  "Cameroun", "Cap-Vert", "Centrafrique", "Comores", "Congo", "Côte d'Ivoire",
  "Djibouti", "Égypte", "Érythrée", "Eswatini", "Éthiopie", "Gabon", "Gambie",
  "Ghana", "Guinée", "Guinée-Bissau", "Guinée équatoriale", "Kenya", "Lesotho",
  "Liberia", "Libye", "Madagascar", "Malawi", "Mali", "Maroc", "Maurice",
  "Mauritanie", "Mozambique", "Namibie", "Niger", "Nigeria", "Ouganda",
  "RD Congo", "Rwanda", "Sao Tomé-et-Principe", "Sénégal", "Seychelles",
  "Sierra Leone", "Somalie", "Soudan", "Soudan du Sud", "Tanzanie", "Tchad",
  "Togo", "Tunisie", "Zambie", "Zimbabwe", "Autre",
];

export const LeadCaptureModal = ({ onClose, onSubmit }: LeadCaptureModalProps) => {
  const [formData, setFormData] = useState<Omit<LeadFormData, "whatsapp">>({
    firstName: "",
    email: "",
    country: "",
  });
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      country: formData.country,
    });

    if (!validationResult.success) {
      toast.error(validationResult.error.errors[0].message);
      return;
    }

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
      onSubmit();
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
      onClick={onClose}
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
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
          aria-label="Fermer la fenêtre"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          <div className="text-center mb-6">
            <h2 id="lead-modal-title" className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Remplis le formulaire pour obtenir ton accès au Webinaire Gratuit !
            </h2>
            <p className="text-muted-foreground">
              Nous t'enverrons aussi le Guide des 10 Bourses à ne pas râter en 2026 !
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="firstName" className="text-foreground font-semibold">
                Prénom <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                ref={firstFieldRef}
                type="text"
                required
                autoComplete="given-name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="mt-1.5 h-12 border-2 focus:border-gold"
                placeholder="Ton prénom"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-foreground font-semibold">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1.5 h-12 border-2 focus:border-gold"
                placeholder="exemple@email.com"
              />
            </div>

            <div>
              <Label htmlFor="whatsapp" className="text-foreground font-semibold">
                WhatsApp <span className="text-destructive">*</span>
              </Label>
              <div className="mt-1.5">
                <PhoneInput
                  defaultCountry="ci"
                  value={phone}
                  onChange={(v) => setPhone(v)}
                  inputClassName="h-12"
                  className="phone-input-custom"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="country" className="text-foreground font-semibold">
                Pays <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.country}
                onValueChange={(value) => setFormData({ ...formData, country: value })}
                required
              >
                <SelectTrigger className="mt-1.5 h-12 border-2 focus:border-gold bg-background">
                  <SelectValue placeholder="Sélectionne ton pays" />
                </SelectTrigger>
                <SelectContent className="bg-card border-2 max-h-[300px]">
                  {africanCountries.map((country) => (
                    <SelectItem key={country} value={country} className="cursor-pointer">
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
      </div>
    </div>
  );
};
