# Plan : optimiser la page pour vendre plus de guides

Objectif : lever les freins à l'achat sur mobile et créer un chemin plus direct vers le paiement, sans changer le prix (9 000 XOF) ni le lien de paiement.

## 1. Rassurer sur le paiement Mobile Money (priorité 1)

- Sous le bouton d'achat : une ligne de moyens de paiement acceptés (Wave, Orange Money, MTN, Moov, carte bancaire) avec des petits badges.
- Ajouter la mention « Paiement depuis ton mobile, sans carte bancaire » à côté du cadenas déjà présent.
- Ajouter une garantie « Satisfait ou remboursé sous 7 jours » près du prix et dans la barre du bas.
- Ajouter 2 questions dans la FAQ : « Comment je paie sans carte bancaire ? » et « Comment je reçois le guide après paiement ? ».

Remarque : je ne connais pas les moyens de paiement réellement activés sur ton lien MoneyFusion, ni si tu veux vraiment promettre un remboursement 7 jours. Dis-moi ce qui est exact avant que je l'affiche.

## 2. Transformer la confirmation du formulaire en offre directe

Après l'inscription au webinaire, l'écran de confirmation propose aujourd'hui seulement de regarder la vidéo. On y ajoute une offre courte : rappel du guide, prix, bouton d'achat, et le lien « regarder le webinaire » en second choix.

## 3. Clarifier la valeur de l'offre

- Afficher la valeur de chaque élément inclus (guide, tableur, modèles, checklists) et un total avant le prix de 9 000 XOF, pour rendre la remise évidente.
- Ajouter une phrase de comparaison simple : le prix d'une seule candidature ratée vs le guide.
- Ajouter juste avant le bouton une ligne « Ce que tu obtiens dans les 2 minutes » (accès immédiat au PDF + fichiers).

## 4. Rendre l'achat atteignable partout

- Ajouter un bouton d'achat court juste sous la vidéo (après la lecture) qui amène à la section offre.
- La barre du bas affiche un rappel de garantie sur écran large, en gardant la mise en page actuelle qui ne débordait plus sur mobile.

## 5. Mesurer l'effet

- Suivre les nouveaux boutons d'achat avec des sources distinctes (confirmation du formulaire, sous la vidéo) pour voir lesquels convertissent.
- Ces chiffres apparaissent dans le tableau de bord existant, dans les clics vers le paiement.

## Détails techniques

- `src/pages/Index.tsx` : blocs paiement/garantie/valeur dans la section offre, bouton sous la vidéo, ajustement barre sticky, nouveaux appels `trackEvent("checkout_click", { location: ... })`.
- `src/components/LeadCaptureModal.tsx` : écran de succès enrichi avec CTA de paiement (URL passée en prop ou constante partagée).
- `src/components/FAQSection.tsx` : deux entrées supplémentaires.
- Badges de paiement en SVG/texte stylé avec les tokens existants (or/bleu), pas de logos externes tant que tu ne fournis pas les visuels officiels.
- Aucune modification de base de données, aucune nouvelle dépendance.
