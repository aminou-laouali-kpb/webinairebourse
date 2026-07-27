## Améliorations proposées pour la landing webinaire

Le socle est propre (edge function sécurisée, RLS, SEO de base, focus trap). Voici ce qui manque vraiment, classé par impact business.

---

### 1. Conversion — le plus gros levier

- **Aucun CTA au-dessus de la ligne de flottaison** : le hero n'a que du texte. Ajouter un bouton "Regarder le webinaire" (scroll vers la vidéo) + un bouton secondaire "Recevoir les ressources gratuites" (ouvre le modal).
- **Le modal ne peut plus être rouvert** : une fois fermé, aucun moyen de s'inscrire aux ressources gratuites. Ajouter un lien/bouton persistant "Recevoir le guide gratuit" (sous la vidéo + dans le footer).
- **Urgence/rareté absente** : le prix annonce "durée limitée" sans compte à rebours. Ajouter un countdown (ex. 24h, persisté en localStorage) dans le bloc offre et dans la sticky bar.
- **Sticky bar mobile uniquement** (`md:hidden`) : sur desktop, après scroll, aucun CTA visible. La rendre visible sur desktop en variante fine.
- **Section garantie/remboursement absente** : ajouter un bandeau "Satisfait ou remboursé 7 jours" (si applicable) — lève majeure d'objection sur un achat à 4 999 XOF.
- **Exit-intent** : déclencher le modal au mouvement de souris vers la fermeture d'onglet (desktop), en plus des 5 s.

### 2. Tracking — actuellement zéro mesure

Rien ne mesure la performance de la page. Ajouter :
- Table `page_events` (ou réutiliser un event log) + envoi d'événements : `page_view`, `video_play`, `modal_open`, `lead_submit`, `checkout_click`.
- Suivi des clics checkout avec `utm` déjà présents dans l'URL Maketou.
- Compteurs dans `/admin` : vues, taux de soumission, clics achat, taux de conversion.
- Option : Meta Pixel / GA4 si tu fais de la pub payante (à confirmer).

### 3. UX & formulaire

- **Double saisie du pays** : l'utilisateur choisit l'indicatif dans `PhoneInput` puis re-sélectionne le pays dans le `Select`. Dériver le pays automatiquement de l'indicatif et supprimer le champ (moins de friction = plus de leads).
- **Erreurs affichées uniquement en toast** : afficher aussi l'erreur sous le champ concerné.
- **Écran de succès dans le modal** au lieu d'une fermeture immédiate + bandeau vert plus bas dans la page (que l'utilisateur ne voit pas forcément).
- **Popup à 5 s trop tôt** : la déclencher plutôt au scroll (~30 %) ou après 20-30 s pour ne pas interrompre le démarrage de la vidéo.

### 4. Contenu & crédibilité

- **Aucun témoignage affiché** (`testimonialsImageUrl` vide) : ajouter 3 témoignages texte + prénom/pays/bourse obtenue. C'est le bloc le plus manquant pour la crédibilité.
- **Section "À propos de moi"** courte avec photo — actuellement seulement 3 badges.
- **Section "Pour qui / pas pour qui"** — qualifie le visiteur et augmente la conversion.
- **Lien "Politique de confidentialité"** pointe sur `#` (mort). Créer une vraie page `/confidentialite`.

### 5. Performance & technique

- **YouTube chargé en dur** : ~500 Ko de JS avant même le clic. Remplacer par une façade (miniature `img` + bouton play qui injecte l'iframe). Gros gain mobile.
- **`public/sitemap.xml` absent** — à créer.
- **Pas de page 404 stylée cohérente** avec la charte (à vérifier).
- **`og:image` pointe encore vers l'image par défaut Lovable** — à remplacer par un visuel du webinaire.

---

### Détails techniques

- Événements analytics : nouvelle table `public.page_events (id, event_type, session_id, metadata jsonb, created_at)` avec GRANT + policy INSERT anon, lecture réservée aux admins via `has_role`.
- Façade YouTube : composant `src/components/YouTubeFacade.tsx`, miniature `https://i.ytimg.com/vi/txFGmhZhpv4/maxresdefault.jpg`, iframe injecté au clic avec `autoplay=1`.
- Countdown : `src/components/CountdownTimer.tsx`, deadline stockée en localStorage à la première visite.
- Dérivation du pays : `react-international-phone` expose le pays via `onChange(value, { country })` — mapper vers un nom FR et supprimer le `Select`.

---

### Ordre suggéré

1. Conversion (CTA hero, réouverture modal, countdown, sticky desktop)
2. Contenu (témoignages, à propos, page confidentialité)
3. Formulaire (suppression du champ pays, écran de succès)
4. Tracking + dashboard
5. Performance (façade YouTube, sitemap, og:image)

Dis-moi quels lots tu veux, ou je pars sur les 1-2-3 (le plus rentable, sans changement backend).
