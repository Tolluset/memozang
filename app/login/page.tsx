import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function Page() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  }

  return (
    <form action="/auth/login" method="post" className="grid">
      <label htmlFor="email">Email</label>
      <input name="email" className=" text-black" />
      <label htmlFor="password">Password</label>
      <input type="password" name="password" className=" text-black" />
      <button>Sign In</button>
      <button formAction="/auth/sign-up">Sign Up</button>
    </form>
  );
}
