import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Puuduvad keskkonnamuutujad SUPABASE_URL ja/või SUPABASE_SERVICE_ROLE_KEY. Vaata .env.example faili."
    );
  }

  client = createClient(url, key, {
    auth: { persistSession: false },
  });
  return client;
}
