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
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-x-4 gap-y-16 px-4 py-12 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] md:gap-x-12">
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
      className="h-64 w-64 justify-self-center overflow-hidden break-all rounded-md bg-secondary p-2 text-3xl text-black md:h-72 md:w-72 md:p-3 md:text-4xl"
    >
      {memo.title}
    </a>
  );
}

function NewMemo({ makenewMemo }: { makenewMemo: () => void }) {
  return (
    <Button variant="transparent" onClick={makenewMemo}>
      <PlusIcon />
    </Button>
  );
}

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-16 w-16 text-primary"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}
