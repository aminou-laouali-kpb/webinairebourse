import { Link } from "react-router-dom";

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <div className="bg-gradient-to-r from-primary via-blue-dark to-primary text-primary-foreground py-6">
      <div className="container max-w-3xl mx-auto px-4">
        <Link to="/" className="text-sm opacity-80 hover:opacity-100 hover:text-gold transition-colors">
          ← Retour au webinaire
        </Link>
        <h1 className="text-3xl md:text-4xl font-black mt-3">Politique de confidentialité</h1>
      </div>
    </div>

    <main className="container max-w-3xl mx-auto px-4 py-10 space-y-8">
      <p className="text-muted-foreground">
        Cette page est maintenue par KPB Éducation pour expliquer comment nous traitons les
        informations que tu nous confies sur cette page de webinaire.
      </p>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-2">Données collectées</h2>
        <p className="text-muted-foreground">
          Lorsque tu remplis le formulaire d'inscription, nous collectons ton prénom, ton adresse
          email, ton numéro WhatsApp et ton pays. Aucune autre donnée personnelle n'est demandée.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-2">Utilisation</h2>
        <p className="text-muted-foreground">
          Ces informations servent uniquement à t'envoyer l'accès au webinaire, les ressources
          gratuites annoncées et nos communications sur les bourses d'études. Nous ne vendons ni ne
          louons tes données à des tiers.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-2">Conservation et sécurité</h2>
        <p className="text-muted-foreground">
          Les inscriptions sont stockées dans notre base de données, dont l'accès en lecture est
          réservé aux administrateurs authentifiés de KPB Éducation.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-2">Désinscription et suppression</h2>
        <p className="text-muted-foreground">
          Tu peux te désinscrire à tout moment de nos emails et messages WhatsApp. Pour demander la
          suppression de tes données, écris-nous à{" "}
          <a href="mailto:contact@kpbeducation.cloud" className="text-primary underline hover:text-gold">
            contact@kpbeducation.cloud
          </a>
          .
        </p>
      </section>
    </main>
  </div>
);

export default Privacy;
