import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Memo from "~/features/memo/Memo";
import { DB } from "~/models/database.types";

export default async function Page({ params }: { params: { id: string } }) {
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

  const memo = memos?.find((memo) => memo.id === +params.id);

  if (!memo) {
    redirect(`/`);
  }

  const makeNewMemo = async () => {
    const { data: newMemo } = await supabase
      .from("memos")
      .insert({ selected: true, title: "unnamed", content: "" })
      .select();

    if (!newMemo) {
      throw new Error("Failed to create new memo");
    }

    return newMemo;
  };

  return (
    <main>
      <Memo key={new Date().getTime()} memo={memo} />
    </main>
  );
}
