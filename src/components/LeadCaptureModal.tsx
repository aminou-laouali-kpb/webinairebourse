import { useState, useEffect } from "react";
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

interface LeadCaptureModalProps {
  onClose: () => void;
  onSubmit: (data: LeadFormData) => void;
}

export interface LeadFormData {
  firstName: string;
  email: string;
  whatsapp: string;
  country: string;
}

interface LeadCaptureModalProps {
  onClose: () => void;
  onSubmit: (data: LeadFormData) => void;
}

const africanCountries = [
  "Algérie", "Angola", "Bénin", "Botswana", "Burkina Faso", "Burundi",
  "Cameroun", "Cap-Vert", "Centrafrique", "Comores", "Congo", "Côte d'Ivoire",
  "Djibouti", "Égypte", "Érythrée", "Eswatini", "Éthiopie", "Gabon", "Gambie",
  "Ghana", "Guinée", "Guinée-Bissau", "Guinée équatoriale", "Kenya", "Lesotho",
  "Liberia", "Libye", "Madagascar", "Malawi", "Mali", "Maroc", "Maurice",
  "Mauritanie", "Mozambique", "Namibie", "Niger", "Nigeria", "Ouganda",
  "RD Congo", "Rwanda", "Sao Tomé-et-Principe", "Sénégal", "Seychelles",
  "Sierra Leone", "Somalie", "Soudan", "Soudan du Sud", "Tanzanie", "Tchad",
  "Togo", "Tunisie", "Zambie", "Zimbabwe", "Autre"
];

export const LeadCaptureModal = ({ onClose, onSubmit }: LeadCaptureModalProps) => {
  const [formData, setFormData] = useState<LeadFormData>({
    firstName: "",
    email: "",
    whatsapp: "",
    country: "",
  });
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !phone || !formData.country) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const leadData = {
        first_name: formData.firstName,
        email: formData.email,
        whatsapp: phone,
        country: formData.country
      };

      const { error } = await supabase
        .from('webinar_leads')
        .insert([leadData]);

      if (error) throw error;
      
      onSubmit({ ...formData, whatsapp: phone });
    } catch (error) {
      console.error('Error saving lead:', error);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-dark/80 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-card rounded-2xl shadow-cta animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
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
                type="text"
                required
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
                  onChange={(phone) => setPhone(phone)}
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
