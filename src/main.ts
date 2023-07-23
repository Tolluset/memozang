import "./main.module.css";
import Layout from "~/components/Layout";
import MemoInput from "~/features/memo/MemoInput";

const app = document.querySelector<HTMLDivElement>("#app")!;
app.appendChild(Layout()).appendChild(MemoInput());
