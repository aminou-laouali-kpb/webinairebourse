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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.firstName && formData.email && formData.whatsapp && formData.country) {
      onSubmit(formData);
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
              Recevoir le replay, les slides et les ressources bonus
            </h2>
            <p className="text-muted-foreground">
              Remplis ce formulaire pour accéder à tout le contenu gratuitement
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
              <Input
                id="whatsapp"
                type="tel"
                required
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="mt-1.5 h-12 border-2 focus:border-gold"
                placeholder="+225 XX XX XX XX XX"
              />
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
              className="w-full h-14 text-lg font-bold bg-gold hover:bg-gold-light text-blue-dark shadow-cta transition-all"
              aria-label="Obtenir les ressources gratuites"
            >
              Je veux les ressources 🎁
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
