import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True cand variabilele de mediu sunt setate. Build-ul trece si fara ele. */
export const supabaseConfigured = Boolean(url && anonKey);

let warned = false;
export function warnMissingConfig(where: string) {
  if (warned) return;
  warned = true;
  console.warn(
    `[supplyhub] Supabase nu este configurat (${where}). ` +
      "Seteaza NEXT_PUBLIC_SUPABASE_URL si NEXT_PUBLIC_SUPABASE_ANON_KEY. Se randeaza fara date.",
  );
}

/** Client public. Citeste doar ce permit politicile RLS. */
export function getPublicClient(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

/**
 * Client cu cheia service-role. Ocoleste RLS.
 * Se importa exclusiv din cod care ruleaza pe server (server actions).
 */
export function getServiceClient(): SupabaseClient | null {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
