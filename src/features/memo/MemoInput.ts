import classes from "./MemoInput.module.css";

export default function MemoInput() {
  function view() {
    const element = document.createElement("div");
    element.classList.add(classes.wrapper);

    element.innerHTML = `
      <div class="${classes.memoInput}" />
    `;

    return element;
  }

  function setup(element: HTMLElement) {
    let memo = "";

    const setMemo = (value: string, element: HTMLDivElement) => {
      memo = value;
      element.innerText = memo;
    };

    const memoInput = element.children[0] as HTMLDivElement;
    memoInput.setAttribute("autofocus", "true");
    memoInput.setAttribute("contenteditable", "true");

    memoInput.addEventListener("change", () => {
      setMemo(memoInput.innerText, memoInput);
    });
    setMemo("", memoInput);

    return element;
  }

  return setup(view());
}
