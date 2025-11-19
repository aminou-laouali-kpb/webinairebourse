import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "Est-ce que le webinaire est vraiment gratuit ?",
    answer: "Oui, 100 % gratuit. Aucune carte bancaire requise. Je veux juste t'aider à comprendre comment candidater intelligemment aux bourses."
  },
  {
    question: "Le guide garantit-il que je vais obtenir une bourse ?",
    answer: "Non, aucune promesse de résultat. Le guide te donne la méthode, les modèles et la clarté nécessaires, mais ton travail et ton profil restent essentiels. C'est un outil, pas une baguette magique."
  },
  {
    question: "Et si je ne suis pas satisfait du guide ?",
    answer: "Tu es protégé par une garantie satisfait ou remboursé de 7 jours. Si le guide ne répond pas à tes attentes, tu peux demander un remboursement complet, sans questions."
  },
  {
    question: "Comment recevrai-je mes accès ?",
    answer: "Immédiatement après ton paiement, tu recevras tous les accès par email et WhatsApp. Tu pourras télécharger le guide PDF, les modèles et le tableur de bourses instantanément."
  },
  {
    question: "Le guide est-il en français ou en anglais ?",
    answer: "Les deux ! Tous les documents sont disponibles en version française ET anglaise pour que tu puisses candidater dans les deux langues selon les exigences des programmes."
  }
];

export const FAQSection = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-10">
          Questions fréquentes
        </h2>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqData.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card border-2 border-border rounded-xl px-6 shadow-card"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-5">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
