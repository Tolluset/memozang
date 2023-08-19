import van from "~/van";
import classes from "./MemoInput.module.css";

const { div } = van.tags;

// @TODO move to constants
type key = "memozang-memo";

// @TODO move to utils
const useLocalStorage = (key: key) => {
  return {
    get: () => localStorage.getItem(key),
    set: (value: string) => localStorage.setItem(key, value),
  };
};

export default function MemoInput() {
  const memoStorage = useLocalStorage("memozang-memo");

  const saveMemo = (memo: string) => {
    memoStorage.set(memo);
  };

  const loadMemo = () => {
    return memoStorage.get();
  };

  const memo = van.state(loadMemo());

  const onKeyUpMemoInput = (e: KeyboardEvent) => {
    const memoInput = e.target as HTMLDivElement;
    saveMemo(memoInput.innerText);
  };

  return div(
    { class: classes.wrapper },
    div(
      {
        class: classes.memoInput,
        contenteditable: true,
        autofocus: true,
        onkeyup: onKeyUpMemoInput,
      },
      memo.val
    )
  );
}
