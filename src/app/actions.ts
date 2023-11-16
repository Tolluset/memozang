"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function patchMemo({ id }: { id: number }, formData: any) {
  const title = formData.get("title");

  const db = createServerActionClient({ cookies });

  const { data: memo } = await db
    .from("memos")
    .update({ title })
    .eq("id", id)
    .select()
    .single();

  return memo;
}
