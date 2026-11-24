# Le Guide Ultime du Boursier Africain

Page de vente de **KPB Education** pour le guide « Bourses 2026-2027 » : une méthode complète en français et en anglais pour décrocher une bourse d'études (guide PDF, tableur de 30 bourses, modèles de CV et de lettres).

## Fonctionnalités

- **Page de vente** du guide, avec formulaire de contact et numéro de téléphone international.
- **Capture des leads** par une fonction Supabase (`submit-lead`).
- **Suivi des visites** et des événements de la page (`track-event`).
- **Tableau de bord admin** protégé par connexion, pour consulter les leads et les statistiques.
- Page de politique de confidentialité.

## Stack

- React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- Supabase : PostgreSQL avec RLS, Auth, Edge Functions
- TanStack Query, React Hook Form, Zod, Recharts

## Structure

```
src/pages/            Index (page de vente), Auth, AdminDashboard, Privacy
supabase/migrations/  tables webinar_leads, page_events, user_roles
supabase/functions/   submit-lead, track-event
```

## Démarrer en local

```bash
npm install
npm run dev
```

Variables d'environnement (fichier `.env`) :

| Variable | Rôle |
|---|---|
| `VITE_SUPABASE_URL` | URL du projet Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | clé publique (anon) Supabase |

Les fonctions Supabase utilisent en plus `SUPABASE_SERVICE_ROLE_KEY`, à définir dans les secrets Supabase.

## Origine

Projet créé avec [Lovable](https://lovable.dev) et maintenu par KPB Education.
