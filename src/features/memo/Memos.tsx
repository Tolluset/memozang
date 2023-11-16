"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Button from "~/ds/Button";
import { DB, Memo } from "~/models/database.types";
import LogoutButton from "../auth/LogoutButton";

export default function Memos({ memos }: { memos: Memo[] | null }) {
  const router = useRouter();
  const db = createClientComponentClient<DB>();

  const makenewMemo = async () => {
    const { data: memo } = await db
      .from("memos")
      .insert({ selected: false, title: "unnamed", content: "" })
      .select()
      .limit(1)
      .single();

    if (!memo) {
      throw new Error("Failed to create new memo");
    }

    router.push(`/memo/${memo.id}`);
  };

  return (
    <div>
      <div className="grid grid-flow-col p-4">
        <div>
          <LogoutButton />
        </div>
        <div className="grid justify-end">
          <NewMemo makenewMemo={makenewMemo} />
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-y-16 px-4 py-12 md:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
        {memos
          ? memos.map((memo) => <MemoPaper key={memo.id} memo={memo} />)
          : "no memos"}
      </div>
    </div>
  );
}

function MemoPaper({ memo }: { memo: Memo }) {
  return (
    <a
      href={`memo/${memo.id}`}
      className="h-40 w-40 justify-self-center bg-secondary text-black md:h-60 md:w-60"
    >
      {memo.title}
    </a>
  );
}

function NewMemo({ makenewMemo }: { makenewMemo: () => void }) {
  return <Button onClick={makenewMemo}>New Memo</Button>;
}
