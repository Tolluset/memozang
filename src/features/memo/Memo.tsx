"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { DB, Memo } from "~/models/database.types";
import { useDebounce } from "~/hooks/useDebounce";
import Button from "~/ds/Button";
import { patchMemo } from "~/app/actions";
import Link from "next/link";
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

  const onDeleteButtonClick = async () => {
    const result = await db.from("memos").delete().eq("id", memo.id);

    if (result.status === 204) {
      router.push("/");
    }

    if (result.error) {
      alert(result.error);
    }
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
        <Link href="/">
          <Button variant="transparent">
            <BackIcon />
          </Button>
        </Link>
        <div className="grid justify-end gap-y-8">
          <MemoTitle memo={memo} />
          <DeleteMemoButton onDeleteButtonClick={onDeleteButtonClick} />
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

function DeleteMemoButton({
  onDeleteButtonClick,
}: {
  onDeleteButtonClick: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialog = dialogRef.current;

  const openDialog = () => {
    dialog?.showModal();
  };

  const closeDialog = useCallback(() => {
    dialog?.close();
  }, [dialog]);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (
        e.target &&
        e.target instanceof HTMLDialogElement &&
        e.target.nodeName === "DIALOG"
      ) {
        closeDialog();
      }
    };

    dialog?.addEventListener("click", clickOutside);

    return () => {
      dialog?.removeEventListener("click", clickOutside);
    };
  }, [dialog, closeDialog]);

  return (
    <>
      <Button
        variant="transparent"
        onClick={openDialog}
        className="justify-self-end"
      >
        <TrashIcon />
      </Button>
      <dialog ref={dialogRef} className="rounded-xl bg-transparent">
        <div className="grid grid-flow-col gap-x-8 rounded-xl bg-gray-700 p-8 ">
          <Button onClick={onDeleteButtonClick}>yes</Button>
          <Button variant="secondary" onClick={closeDialog}>
            no
          </Button>
        </div>
      </dialog>
    </>
  );
}

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
              placeholder={titleState ?? ""}
              className="text-3xl text-black"
            />
          </form>
        </div>
      ) : (
        <Button
          variant="transparent"
          onClick={startEditing}
          className=" grid grid-flow-col items-center gap-x-2 justify-self-end bg-transparent text-2xl"
        >
          <h1 className="justify-self-end text-4xl">{titleState}</h1>
          <PencilIcon />
        </Button>
      )}
    </div>
  );
}

function BackIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-12 w-12"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5 8.25 12l7.5-7.5"
      />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-10 w-10"
    >
      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
      <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-10 w-10"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
      />
    </svg>
  );
}
