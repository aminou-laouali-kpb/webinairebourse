import { Check, X } from "lucide-react";

const forYou = [
  "Tu es étudiant africain et tu veux étudier à l'étranger",
  "Tu as déjà postulé sans succès et tu ne sais pas pourquoi",
  "Tu veux un dossier solide plutôt que 50 candidatures au hasard",
  "Tu es prêt à travailler ta candidature sérieusement",
];

const notForYou = [
  "Tu cherches une bourse garantie sans effort",
  "Tu veux qu'on remplisse ton dossier à ta place",
  "Tu n'es pas prêt à consacrer quelques heures par semaine",
];

export const WhoIsFor = () => (
  <section className="bg-muted py-12 md:py-16">
    <div className="container max-w-4xl mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-10">
        C'est pour toi (ou pas)
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card rounded-2xl p-6 shadow-card border-2 border-gold">
          <h3 className="font-bold text-lg text-foreground mb-4">✅ C'est pour toi si…</h3>
          <ul className="space-y-3">
            {forYou.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-card rounded-2xl p-6 shadow-card border-2 border-border">
          <h3 className="font-bold text-lg text-foreground mb-4">❌ Ce n'est pas pour toi si…</h3>
          <ul className="space-y-3">
            {notForYou.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);
