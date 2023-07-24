import classes from "./MemoInput.module.css";

export default function MemoInput() {
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
