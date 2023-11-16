"use client";

import React, { useEffect, useRef, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { DB, DBClient, Memo } from "~/models/database.types";
import { useDebounce } from "~/hooks/useDebounce";
import LogoutButton from "../auth/LogoutButton";
import Button from "~/ds/Button";
import { useRouter } from "next/navigation";

export default function MemoInput({ memo }: { memo: Memo }) {
  const [mounted, setMounted] = useState(false);

  const editableRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const db = createClientComponentClient<DB>();

  const onKeyUpMemoInput = useDebounce(
    async (event: React.KeyboardEvent<HTMLDivElement>) => {
      const memoInput = event.target as HTMLDivElement;
      const parsedMemo = memoInput.innerText.replace(/\n\n/gm, "\n");

      await db
        .from("memos")
        .update({ content: parsedMemo, updated_at: new Date().toISOString() })
        .eq("id", memo.id);
    },
    1000,
  );

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

  const backToMemos = () => {
    router.push(`/`);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editableRef.current && mounted) {
      focusContentEditableTextToEnd(editableRef.current);
    }
  }, [mounted]);

  return (
    <div className="grid">
      <div className="px-4 py-8">
        <div className="grid grid-flow-col justify-start gap-x-4">
          <Button onClick={backToMemos}>←</Button>
          <NewMemo makenewMemo={makenewMemo} />
          {/* <LogoutButton /> */}
        </div>
      </div>
      <div
        contentEditable
        suppressContentEditableWarning
        onKeyUp={onKeyUpMemoInput}
        ref={editableRef}
        className="text-size height-[calc(100% - 3rem)] inline-block break-all p-8 text-[1.8rem] text-white outline-none md:px-24  md:py-20 md:text-[2rem]"
      >
        {memo && <div>{bakeTags(memo.content ?? "")}</div>}
      </div>
    </div>
  );
}

const focusContentEditableTextToEnd = (element: HTMLElement) => {
  if (element.innerText.length === 0) {
    element.focus();
    return;
  }

  const selection = window.getSelection();
  const newRange = document.createRange();
  newRange.selectNodeContents(element);
  newRange.collapse(false);
  selection?.removeAllRanges();
  selection?.addRange(newRange);
};

const bakeTags = (memo: string) => {
  const memos = memo.split("\n");

  return memos.map((m, i) => {
    return (
      <div key={i}>
        {m}
        {memos.length - 1 !== i && <br />}
      </div>
    );
  });
};

function NewMemo({ makenewMemo }: { makenewMemo: () => void }) {
  return <Button onClick={makenewMemo}>New Memo</Button>;
}
