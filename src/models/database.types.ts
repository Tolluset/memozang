import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Json as JsonGenerated } from "./database-generated.types";
import { Database as DatabaseGenerated } from "./database-generated.types";

export type DB = DatabaseGenerated;
export type DBClient = SupabaseClient<DB, "public", any>;

export type Json = JsonGenerated;
export type Tables<T extends keyof DB["public"]["Tables"]> =
  DB["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof DB["public"]["Enums"]> =
  DB["public"]["Enums"][T];

export type Memo = Tables<"memos">;
