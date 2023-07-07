import { z } from "zod";

export const envSchema = z.object({
  // Specify your environment variables schema here
  SUPABASE_PROJECT_REF: z.string()
});
