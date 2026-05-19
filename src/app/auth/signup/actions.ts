"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  try {
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      options: JSON.parse(formData.get("options") as string),
    };
    const { data: authData, error } = await supabase.auth.signUp(data);
    if (error) {
      return { success: false, error: error.message };
    }

    if (authData?.user?.identities?.length === 0) {
      return {
        success: false,
        error: "Account already exists or needs verification. Please log in.",
      };
    }

    revalidatePath("/", "layout");
    return {success :true , error: null};
  } catch (err) {
    console.error("Unexpected error during Sign Up:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
