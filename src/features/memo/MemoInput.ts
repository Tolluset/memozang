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

export function MemoInputWithoutVan() {
  let memo = "";
  const setMemo = (value: string) => {
    memo = value;
  };

  function view() {
    const element = document.createElement("div");
    element.classList.add(classes.wrapper);

    element.innerHTML = `
      <div class="${classes.memoInput}" />
    `;

    return element;
  }

  function setup(element: HTMLElement) {
    const saveMemo = (memo: string) => {
      localStorage.setItem("memozang-memo", memo);
    };

    const loadMemo = () => {
      return localStorage.getItem("memozang-memo");
    };

    memo = loadMemo() ?? "";

    const memoInput = element.children[0] as HTMLDivElement;

    memoInput.setAttribute("contenteditable", "true");
    memoInput.setAttribute("autofocus", "true");
    memoInput.focus();

    memoInput.innerText = memo;

    memoInput.addEventListener("keyup", () => {
      setMemo(memoInput.innerText);
      saveMemo(memo);
    });

    return element;
  }

  function render() {
    return setup(view());
  }

  return render();
}
