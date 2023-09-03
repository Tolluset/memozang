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
  const { data: memos } = await supabase.from("memos").select();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  if (!memos) {
    return "no data...";
  }

  const selected_memo = 0;

  return (
    <main>
      <Memo memo={memos[selected_memo]} />
    </main>
  );
}
