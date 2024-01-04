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
    <div className="grid h-screen grid-cols-[minmax(0,_512px)] items-center justify-center px-6">
      <form action="/auth/login" method="post">
        <Inputs />
        <Buttons />
      </form>
    </div>
  );
}

function Inputs() {
  return (
    <div className="grid gap-y-4">
      <div className="grid gap-y-2">
        <label htmlFor="email" className="text-2xl">
          Email
        </label>
        <input
          type="email"
          name="email"
          autoComplete="email"
          className="h-10 rounded-lg bg-gray-500 px-3 text-2xl text-white"
        />
      </div>
      <div className="grid gap-y-2">
        <label htmlFor="password" className="text-2xl">
          Password
        </label>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          className="h-10 rounded-lg bg-gray-500 px-3 text-2xl text-white"
        />
      </div>
    </div>
  );
}

function Buttons() {
  return (
    <div className="grid w-full gap-8 pt-14">
      <Button className="w-full">Sign In</Button>
      <Button
        variant="outlined"
        formAction="/auth/sign-up"
        className="w-full justify-self-center"
      >
        Sign Up
      </Button>
    </div>
  );
}
