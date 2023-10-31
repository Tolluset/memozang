"use client";

import React, { useEffect, useRef, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database, Tables } from "~/models/database.types";
import { useDebounce } from "~/hooks/useDebounce";
import LogoutButton from "../auth/LogoutButton";

export default function MemoInput({ memo }: { memo: Tables<"memos"> }) {
  const [mounted, setMounted] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(memo.updated_at);

  const editableRef = useRef<HTMLDivElement>(null);

  const supabase = createClientComponentClient<Database>();

  const onKeyUpMemoInput = useDebounce(
    async (event: React.KeyboardEvent<HTMLDivElement>) => {
      const memoInput = event.target as HTMLDivElement;
      const parsedMemo = memoInput.innerText.replace(/\n\n/gm, "\n");

      await supabase
        .from("memos")
        .update({ content: parsedMemo, updated_at: new Date().toISOString() })
        .eq("id", memo.id);

      setUpdatedAt(new Date().toLocaleString("en-US"));
    },
    1000,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editableRef.current && mounted) {
      focusContentEditableTextToEnd(editableRef.current);
    }
  }, [mounted]);

  const memoCreatedAt = memo.created_at
    ? new Date(memo?.created_at).toLocaleString("en-US")
    : "unknown";

  const memoUpdatedAt = updatedAt
    ? new Date(updatedAt).toLocaleString("en-US")
    : "unknown";

  return (
    <div className="grid">
      <LogoutButton />
      <LogoutButton />
      <div className="grid justify-end">
        <div>created: {memoCreatedAt}</div>
        <div>updated: {memoUpdatedAt}</div>
      </div>
      <div
        contentEditable
        suppressContentEditableWarning
        onKeyUp={onKeyUpMemoInput}
        ref={editableRef}
        className="inline-block outline-none break-all text-size text-white text-[1.8rem] md:text-[2rem] height-[calc(100% - 3rem)] px-7 py-8  md:px-24 md:py-20"
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
