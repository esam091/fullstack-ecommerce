"use server";
import { redirect } from "next/navigation";

export default async function formAction(formData: FormData) {
  redirect(`/search?min=${formData.get("min")?.toString()}`);
}
