"use client";

import React, { useEffect, useRef, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "~/models/database.types";
import { redirect } from "next/navigation";

export default function MemoInput({ memo }: { memo: any }) {
  const [mounted, setMounted] = useState(false);
  const [typedMemo, setTypedMemo] = useState("");

  const editableRef = useRef<HTMLDivElement>(null);

  const onKeyUpMemoInput = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const memoInput = event.target as HTMLDivElement;
    setTypedMemo(memoInput.innerText.replace(/\n\n/gm, "\n"));
  };

  const onSaveButtonClick = async () => {
    const supabase = createClientComponentClient<Database>();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user.id === undefined) {
      redirect("/login");
    }

    await supabase.from("memos").insert({
      user_id: session?.user.id,
      content: typedMemo,
    });
  };

  const onUpdateButtonClick = async () => {
    const supabase = createClientComponentClient();
    await supabase
      .from("memos")
      .update({ content: typedMemo, updated_at: new Date() })
      .eq("id", memo.id);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editableRef.current && mounted === true) {
      focusContentEditableTextToEnd(editableRef.current);
    }
  }, [mounted]);

  return (
    <div className="grid">
      <div>
        <button
          onClick={onSaveButtonClick}
          className="bg-gray-600 round font-bold text-2xl px-2 py-1"
        >
          save
        </button>
      </div>
      <div>
        <button
          onClick={onUpdateButtonClick}
          className="bg-gray-600 round font-bold text-2xl px-2 py-1"
        >
          update
        </button>
      </div>
      <div
        contentEditable
        suppressContentEditableWarning
        onKeyUp={onKeyUpMemoInput}
        ref={editableRef}
        className="inline-block outline-none break-all text-size text-white text-[1.8rem] md:text-[2rem] height-[calc(100% - 3rem)] px-7 py-8  md:px-24 md:py-20"
      >
        {memo && <div>{bakeTags(memo.content)}</div>}
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
  const memoLength = memos.length;

  return memos.map((m, i) => {
    return (
      <div key={i}>
        {m}
        {memoLength - 1 !== i && <br />}
      </div>
    );
  });
};
