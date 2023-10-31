"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "~/models/database.types";
import Button from "~/ds/Button";

export default function LogoutButton() {
  const supabase = createClientComponentClient<Database>();

  const onClickLogoutButton = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <Button variant="secondary" onClick={onClickLogoutButton}>
      Logout
    </Button>
  );
}
