import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const LeadSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/),
  email: z.string().trim().email().max(255),
  whatsapp: z.string().min(10).max(20),
  country: z.string().trim().min(1).max(100),
});

const WEBHOOKS = [
  "https://n8n.kpbeducation.cloud/webhook-test/4eb9600d-11f6-44db-8782-6250f874a7ba",
  "https://n8n.kpbeducation.cloud/webhook/4eb9600d-11f6-44db-8782-6250f874a7ba",
];

async function fanoutWebhooks(payload: Record<string, unknown>) {
  const results = await Promise.allSettled(
    WEBHOOKS.map((url) =>
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      }).then(async (res) => {
        // Consume body to avoid resource leak
        await res.text();
        if (!res.ok) throw new Error(`${url} → ${res.status}`);
        return url;
      }),
    ),
  );

  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(`Webhook ${i + 1} failed:`, r.reason);
    } else {
      console.log(`Webhook ${i + 1} OK`);
    }
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const parsed = LeadSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid input",
          issues: parsed.error.flatten().fieldErrors,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const lead = {
      first_name: parsed.data.firstName.trim(),
      email: parsed.data.email.trim().toLowerCase(),
      whatsapp: parsed.data.whatsapp,
      country: parsed.data.country,
    };

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { error } = await supabase.from("webinar_leads").insert([lead]);

    let alreadyRegistered = false;
    if (error) {
      if (error.code === "23505") {
        alreadyRegistered = true;
      } else {
        console.error("Insert error:", error);
        return new Response(
          JSON.stringify({ error: "Database error" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    // Fire webhooks even for already-registered (n8n may want to re-send resources)
    await fanoutWebhooks(lead);

    return new Response(
      JSON.stringify({ success: true, alreadyRegistered }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
