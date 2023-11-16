import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Memos from "~/features/memo/Memos";
import { DB } from "~/models/database.types";

export default async function Page() {
  const supabase = createServerComponentClient<DB>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: memos } = await supabase
    .from("memos")
    .select()
    .match({ "user_id ": session.user.id });

  return (
    <main>
      <Memos memos={memos} />
    </main>
  );
}
