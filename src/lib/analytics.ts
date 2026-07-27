import { supabase } from "@/integrations/supabase/client";

export type TrackEventType =
  | "page_view"
  | "video_play"
  | "modal_open"
  | "lead_submit"
  | "checkout_click";

const SESSION_KEY = "kpb_session_id";

const getSessionId = () => {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "anonymous";
  }
};

/** Fire-and-forget analytics event. Never blocks or throws in the UI. */
export const trackEvent = (
  eventType: TrackEventType,
  metadata: Record<string, unknown> = {},
) => {
  void supabase.functions
    .invoke("track-event", {
      body: { eventType, sessionId: getSessionId(), metadata },
    })
    .catch(() => {
      /* analytics must never break the page */
    });
};
