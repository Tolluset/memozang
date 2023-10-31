import { Json as JsonGenerated } from "./database-generated.types";
import { Database as DatabaseGenerated } from "./database-generated.types";

export type Database = DatabaseGenerated;

export type Json = JsonGenerated;
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
