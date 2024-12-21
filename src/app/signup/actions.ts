"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  try {
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      options: JSON.parse(formData.get("options") as string),
    };
    console.log(data.options.data.name);
    const { error } = await supabase.auth.signUp(data);
    if (error) {
      return { success: false, error: error.message };
    }
  } catch (err) {
    console.error("Unexpected error during Sign Up:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
  revalidatePath("/", "layout");
  redirect("/signup/confirm");
}
