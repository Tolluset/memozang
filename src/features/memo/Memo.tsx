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

  return (
    <div className="grid grid-flow-row justify-end">
      <EditMemoTitle
        memo={memo}
        isEditing={isEditing}
        startEditing={startEditing}
        finishEditing={finishEditing}
        updateTitle={updateTitle}
      />
      {!isEditing && (
        <h1 className="justify-self-end text-2xl">{titleState}</h1>
      )}
    </div>
  );
}

function EditMemoTitle({
  memo,
  isEditing,
  startEditing,
  finishEditing,
  updateTitle,
}: {
  memo: Memo;

  isEditing: boolean;
  startEditing: () => void;
  finishEditing: () => void;
  updateTitle: (title: string) => void;
}) {
  const patchMemoWithId = patchMemo.bind(null, { id: memo.id });

  return isEditing ? (
    <form
      action={async (formData) => {
        const res = await patchMemoWithId(formData);

        updateTitle(res.title);
        finishEditing();
      }}
    >
      <input type="text" name="title" className="text-black" />
    </form>
  ) : (
    <Button onClick={startEditing} className="justify-self-end text-xl">
      E
    </Button>
  );
}
