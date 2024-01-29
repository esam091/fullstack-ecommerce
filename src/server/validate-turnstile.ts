import "server-only";
import { env } from "@/env";

import z from "zod";

const schema = z.object({
  success: z.boolean(),
});

export default async function validateTurnstile(
  token: string,
): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append("secret", env.TURNSTILE_SECRET_KEY);
    formData.append("response", token);

    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const result = await fetch(url, {
      body: formData,
      method: "POST",
    });

    const outcome = schema.parse(await result.json());
    return outcome.success;
  } catch (e) {
    return false;
  }

  return true;
}
