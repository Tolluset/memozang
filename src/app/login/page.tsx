import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Button from "~/ds/Button";

export default async function Page() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="grid items-center justify-center px-6 h-screen grid-cols-[minmax(0,_512px)]">
      <form action="/auth/login" method="post">
        <Inputs />
        <Buttons />
      </form>
    </div>
  );
}

function Inputs() {
  return (
    <div className="grid">
      <label htmlFor="email" className="text-xl">
        Email
      </label>
      <input name="email" className="text-black h-10" />
      <label htmlFor="password" className="text-xl">
        Password
      </label>
      <input type="password" name="password" className="text-black h-10" />
    </div>
  );
}

function Buttons() {
  return (
    <div className="grid gap-8 pt-16 w-full">
      <Button className="w-full">Sign In</Button>
      <Button variant="secondary" formAction="/auth/sign-up" className="w-full">
        Sign Up
      </Button>
    </div>
  );
}
