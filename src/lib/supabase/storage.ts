// src/lib/supabase/storage.ts

import { createClient } from "@/lib/supabase/server";

export async function uploadBrokerLogo(
  file: File,
  brokerId: string
): Promise<string> {
  const supabase = await createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${brokerId}-${Date.now()}.${fileExt}`;
  const filePath = `logos/${fileName}`;

  const { data, error } = await supabase.storage
    .from("broker-assets")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw error;

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("broker-assets").getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteBrokerLogo(url: string) {
  const supabase = await createClient();
  const path = url.split("/broker-assets/")[1];

  if (!path) return;

  const { error } = await supabase.storage.from("broker-assets").remove([path]);

  if (error) throw error;
}
