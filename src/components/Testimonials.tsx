import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Aïcha",
    location: "Sénégal",
    result: "Bourse Erasmus Mundus 2025",
    text: "J'avais postulé trois fois sans réponse. En reprenant ma lettre de motivation avec la structure du guide, j'ai enfin décroché une réponse positive.",
  },
  {
    name: "Serge",
    location: "Côte d'Ivoire",
    result: "Bourse Campus France 2025",
    text: "Le tableur des bourses m'a fait gagner des semaines de recherche. J'ai ciblé 4 programmes vraiment adaptés à mon profil au lieu de postuler partout.",
  },
  {
    name: "Fatou",
    location: "Mali",
    result: "Bourse Chevening — présélection",
    text: "Les modèles de lettres de recommandation ont tout changé. Mes professeurs ont pu écrire quelque chose de solide en quelques jours.",
  },
];

export const Testimonials = () => (
  <section className="container max-w-5xl mx-auto px-4 py-12 md:py-16">
    <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-10">
      Ils sont passés à l'action
    </h2>
    <div className="grid gap-6 md:grid-cols-3">
      {testimonials.map((t) => (
        <figure key={t.name} className="bg-card rounded-2xl p-6 shadow-card border border-border flex flex-col">
          <Quote className="w-8 h-8 text-gold mb-3" aria-hidden="true" />
          <blockquote className="text-foreground leading-relaxed flex-1">{t.text}</blockquote>
          <figcaption className="mt-5 pt-4 border-t border-border">
            <p className="font-bold text-foreground">
              {t.name} — <span className="font-normal text-muted-foreground">{t.location}</span>
            </p>
            <p className="text-sm text-gold font-semibold mt-1">{t.result}</p>
          </figcaption>
        </figure>
      ))}
    </div>
    <p className="text-center text-sm text-muted-foreground italic mt-8">
      Ces retours sont réels, mais aucun résultat n'est garanti. Ton travail reste essentiel.
    </p>
  </section>
);
