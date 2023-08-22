"use client";

import React, { useEffect, useRef, useState } from "react";
import { LocalStorage } from "~/utils/localStorageManager";

export default function MemoInput() {
  const saveMemo = (memo: string) => {
    LocalStorage.setItem("memozang-memo", memo);
  };

  const loadMemo = () => {
    return LocalStorage.getItem("memozang-memo") ?? "";
  };

  const [mounted, setMounted] = useState(false);
  const [memo, setMemo] = useState<string>(loadMemo);
  const editableRef = useRef<HTMLDivElement>(null);

  const onKeyUpMemoInput = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const memoInput = event.target as HTMLDivElement;
    saveMemo(memoInput.innerText);
  };

  const trimming = (text: string) => {
    return text
      .split("\n")
      .map((line) => {
        console.log(line);
        return line.trim() === "" ? "" : line;
      })
      .join("<br>");
  };

  useEffect(() => {
    if (editableRef.current) {
      focusContentEditableTextToEnd(editableRef.current);
    }

    setMounted(true);
  }, []);

  return (
    <div className="grid">
      <div
        contentEditable
        suppressContentEditableWarning
        onKeyUp={onKeyUpMemoInput}
        dangerouslySetInnerHTML={{
          __html: mounted ? trimming(memo ?? "") : "",
        }}
        ref={editableRef}
        className="outline-none break-all text-size text-white text-[1.8rem] md:text-[2rem] height-[calc(100% - 3rem)] px-7 py-8  md:px-24 md:py-20"
      />
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
