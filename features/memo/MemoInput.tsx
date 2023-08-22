"use client";

import React, { useEffect, useRef, useState } from "react";

// @TODO move to constants
type key = "memozang-memo";

// @TODO move to utils
const localStorageManager = (key: key) => {
  return {
    get: () => localStorage.getItem(key),
    set: (value: string) => localStorage.setItem(key, value),
  };
};

const memoStorage = localStorageManager("memozang-memo");

const saveMemo = (memo: string) => {
  memoStorage.set(memo);
};

const loadMemo = () => {
  return memoStorage.get() ?? "";
};

export default function MemoInput() {
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
  }, []);

  return (
    <div className="grid">
      <div
        contentEditable
        suppressContentEditableWarning
        autoFocus
        onKeyUp={onKeyUpMemoInput}
        dangerouslySetInnerHTML={{ __html: trimming(memo ?? "") }}
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
