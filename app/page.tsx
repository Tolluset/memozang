import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Memo from "~/features/memo/Memo";
import { Database } from "~/models/database.types";

export type Memo = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export default async function Page() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: selectedMemo } = await supabase
    .from("memos")
    .select()
    .match({ "user_id ": session.user.id, selected: true })
    .limit(1)
    .single();

  async function makeNewMemo() {
    const { data: newMemo } = await supabase
      .from("memos")
      .insert({ selected: true, content: "" })
      .select()
      .limit(1)
      .single();

    if (!newMemo) {
      throw new Error("Failed to create new memo");
    }

    return newMemo;
  }

  return (
    <main>
      <Memo memo={selectedMemo ? selectedMemo : await makeNewMemo()} />
    </main>
  );
}
