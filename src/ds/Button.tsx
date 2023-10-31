export default function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="bg-indigo-500 w-fit font-bold text-[1.8rem]">
      {children}
    </button>
  );
}
