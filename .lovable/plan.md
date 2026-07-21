## Audit complet + refactor de la mini-app webinaire

Plan structuré en 4 lots. Chaque lot est indépendant et peut être validé séparément.

---

### Lot 1 — Nettoyage code mort & bugs

**`src/components/LeadCaptureModal.tsx`**
- Supprimer l'interface `LeadCaptureModalProps` dupliquée (lignes 49-52)
- Retirer l'appel `onSubmit({ ...formData, whatsapp: phone })` redondant : les données sont déjà envoyées à Supabase + webhooks, `onSubmit` sert juste à fermer le modal → simplifier en `onSubmit()`

**`src/pages/Index.tsx`**
- Supprimer le `console.log("Lead data:", data)` et le commentaire TODO obsolète (lignes 51-55) — le backend est déjà branché
- Unifier les clés localStorage : `hasSubmittedLead` (modal) + `kpb_lead_captured` (page) → une seule clé `kpb_lead_status` avec valeurs `"submitted" | "closed"`
- Simplifier `handleLeadSubmit` : ne garde que la fermeture modal + toast + confirmation

**Cohérence pays / téléphone**
- Le `Select` pays ne liste que l'Afrique + "Autre", mais le `PhoneInput` accepte tous les pays. Deux options :
  - **A (recommandé)** : Garder l'Afrique + "Autre" (cible marketing = étudiants africains, cohérent avec le contenu)
  - **B** : Passer à liste mondiale complète
  - → À valider en implémentation, je pars sur **A** (statu quo, juste corriger le doublon si présent).

---

### Lot 2 — Fiabilité & sécurité des webhooks

**Problème actuel :** URLs webhook n8n exposées côté client (visibles dans le bundle), n'importe qui peut les spammer avec `curl`. Pas de retry, erreurs silencieuses.

**Solution :** Créer une edge function `submit-lead` qui :
1. Reçoit `{firstName, email, whatsapp, country}` du client
2. Re-valide avec Zod côté serveur
3. Insère dans `webinar_leads` (via service role, respecte la contrainte unique email)
4. Envoie aux 2 webhooks n8n (test + prod, gardés comme demandé) avec `Promise.allSettled` + timeout 5s
5. Logue les échecs webhook dans les logs edge function
6. Retourne `{ success, alreadyRegistered }` au client

**Côté client** (`LeadCaptureModal.tsx`) :
- Remplacer l'insert Supabase direct + les 2 `fetch` par un seul `supabase.functions.invoke('submit-lead', {...})`
- Gérer `alreadyRegistered` → toast informatif
- Les URLs webhook disparaissent du bundle JS

**Bénéfices :**
- URLs webhook cachées (secrets côté serveur si on veut, mais pas obligatoire ici — les URLs restent en clair dans l'edge function)
- Validation double (client + serveur)
- Logs centralisés

---

### Lot 3 — SEO & Performance

**`index.html`**
- Vérifier/ajouter `<title>` et `<meta name="description">` spécifiques au webinaire (pas les defaults Lovable)
- Ajouter `og:title`, `og:description`, `og:type=website`, `twitter:card=summary_large_image`
- Ajouter JSON-LD `Event` (webinaire) pour rich snippets Google
- `<link rel="canonical" href="https://webinar1.kpbeducation.cloud/" />`

**`src/pages/Index.tsx`**
- Iframe YouTube : ajouter `loading="lazy"` + `referrerpolicy="strict-origin-when-cross-origin"`
- Convertir le `<br>` du H1 en espace + span pour meilleure sémantique + responsive
- Ajouter `alt` descriptifs manquants (déjà OK sur guide, vérifier tout)

**Optionnel** : lazy-load l'iframe YouTube via une image thumbnail cliquable (grosse économie de bande passante mobile — Google recommande ce pattern). À décider.

---

### Lot 4 — UX & cohérence

- **Remplacer le placeholder Unsplash** des témoignages par une image générée ou masquer la section tant qu'aucune image réelle n'est fournie (actuellement affiche des inconnus, contre-productif pour la crédibilité)
- **Message de confirmation dupliqué** : le toast Sonner + le bloc vert sous vidéo affichent le même message → garder uniquement le bloc vert sous vidéo (plus visible, persistant 10s) et retirer le toast redondant
- **Séparateur visuel** entre l'indicatif téléphone et l'input (actuellement collés)
- **Focus trap** dans le modal : quand on Tab dans le modal, on peut sortir vers la page derrière — ajouter un focus trap simple

---

### Détails techniques

**Edge function `submit-lead`** — squelette :

```typescript
// supabase/functions/submit-lead/index.ts
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { z } from 'npm:zod@3'

const Schema = z.object({
  firstName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255).toLowerCase(),
  whatsapp: z.string().min(10).max(20),
  country: z.string().min(1),
})

const WEBHOOKS = [
  'https://n8n.kpbeducation.cloud/webhook-test/4eb9600d-11f6-44db-8782-6250f874a7ba',
  'https://n8n.kpbeducation.cloud/webhook/4eb9600d-11f6-44db-8782-6250f874a7ba',
]

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  // ... validate, insert, fanout webhooks avec Promise.allSettled + AbortSignal.timeout(5000)
})
```

**Diagramme du flux après refactor :**

```text
[Client Form] --invoke--> [Edge Function submit-lead]
                              |
                              +--> [Supabase webinar_leads INSERT]
                              +--> [n8n webhook-test/... POST]
                              +--> [n8n webhook/... POST]
                              |
                              <-- { success, alreadyRegistered }
```

---

### Ordre d'implémentation

1. Lot 1 (nettoyage) — 5 min, sans risque
2. Lot 3 (SEO/perf) — 5 min, sans risque
3. Lot 4 (UX) — 10 min
4. Lot 2 (edge function webhooks) — 15 min, à tester

**Hors scope (à faire séparément si tu veux) :**
- Analytics conversion (nombre de vues, taux de soumission, clics achat)
- Rate limiting IP côté edge function
- CAPTCHA
- Extraction de `CONFIG` (YouTube URL, images) vers table Supabase `settings` éditable depuis l'admin
