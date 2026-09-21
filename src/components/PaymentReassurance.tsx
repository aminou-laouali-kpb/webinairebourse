import { ShieldCheck, Smartphone, Zap } from "lucide-react";
import { PAYMENT_METHODS } from "@/lib/offer";

/** Badges des moyens de paiement + garantie, affichés sous les boutons d'achat. */
export const PaymentReassurance = ({ compact = false }: { compact?: boolean }) => (
  <div className={compact ? "mt-3" : "mt-5"}>
    <div className="flex flex-wrap items-center justify-center gap-2">
      {PAYMENT_METHODS.map((method) => (
        <span
          key={method}
          className="px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/20 text-xs font-bold text-primary"
        >
          {method}
        </span>
      ))}
    </div>

    <div className="mt-4 grid gap-2 sm:grid-cols-3 text-sm text-muted-foreground">
      <p className="flex items-center justify-center gap-2">
        <Smartphone className="w-4 h-4 text-gold flex-shrink-0" aria-hidden="true" />
        Paiement mobile, sans carte
      </p>
      <p className="flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" aria-hidden="true" />
        Satisfait ou remboursé 7 jours
      </p>
      <p className="flex items-center justify-center gap-2">
        <Zap className="w-4 h-4 text-gold flex-shrink-0" aria-hidden="true" />
        Accès immédiat après paiement
      </p>
    </div>
  </div>
);
