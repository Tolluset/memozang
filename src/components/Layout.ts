import classes from "./Layout.module.css";

export default function Layout() {
  function view() {
    const element = document.createElement("div");

    element.classList.add(classes.layout);

    return element;
  }

  function setup(element: HTMLDivElement) {
    return element;
  }

  return setup(view());
}
