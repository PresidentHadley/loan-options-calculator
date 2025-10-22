// src/lib/supabase/server.ts

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export const createClient = async () => {
  const cookieStore = await cookies();

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: {
          getItem: (key: string) => {
            return cookieStore.get(key)?.value ?? null;
          },
          setItem: (key: string, value: string) => {
            try {
              cookieStore.set(key, value);
            } catch (error) {
              // Handle the case where set is called from a Server Component
            }
          },
          removeItem: (key: string) => {
            try {
              cookieStore.delete(key);
            } catch (error) {
              // Handle the case where remove is called from a Server Component
            }
          },
        },
      },
    }
  );
};
