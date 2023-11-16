import { Memo } from "~/models/database.types";

export const dynamic = "force-dynamic";

export default function Memos({ memos }: { memos: Memo[] | null }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-y-16 px-4 py-12 md:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
      {memos
        ? memos.map((memo) => <MemoPaper key={memo.id} memo={memo} />)
        : "no memos"}
    </div>
  );
}

function MemoPaper({ memo }: { memo: Memo }) {
  return (
    <a
      href={`memo/${memo.id}`}
      className="h-40 w-40 justify-self-center bg-secondary text-black md:h-60 md:w-60"
    >
      {memo.title}
    </a>
  );
}
