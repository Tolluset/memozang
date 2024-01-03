"use client";

import React, { useEffect, useRef, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { DB, Memo } from "~/models/database.types";
import { useDebounce } from "~/hooks/useDebounce";
import Button from "~/ds/Button";
import { useRouter } from "next/navigation";
import { patchMemo } from "~/app/actions";

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
      <div className="grid grid-flow-col px-4 py-8">
        <Button onClick={backToMemos}>←</Button>
        <MemoTitle memo={memo} />
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

function MemoTitle({ memo }: { memo: Memo }) {
  const [titleState, setTitleState] = useState(memo.title);
  const [isEditing, setIsEditing] = useState(false);

  const updateTitle = (title: string) => {
    setTitleState(title);
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const finishEditing = () => {
    setIsEditing(false);
  };

  const patchMemoWithId = patchMemo.bind(null, { id: memo.id });

  return (
    <div className="grid grid-flow-row justify-end">
      {isEditing ? (
        <div className="grid items-center">
          <form
            action={async (formData) => {
              const res = await patchMemoWithId(formData);

              updateTitle(res.title);
              finishEditing();
            }}
          >
            <input
              type="text"
              name="title"
              value={titleState ?? ""}
              className="text-3xl text-black"
            />
          </form>
        </div>
      ) : (
        <Button
          onClick={startEditing}
          className=" grid grid-flow-col items-center gap-x-2 justify-self-end bg-transparent text-2xl"
        >
          <h1 className="justify-self-end text-2xl">{titleState}</h1>
          <PencilIcon />
        </Button>
      )}
    </div>
  );
}

function PencilIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
    >
      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
      <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
    </svg>
  );
}
