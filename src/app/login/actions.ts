"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();
  try {
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error during sign-in:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signInWithGoogle(redirectTo: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });

  if (error) {
    console.error("OAuth error:", error);
    // Handle error appropriately
    return;
  }

  if (data?.url) {
    console.log("Redirect URL:", data.url);
    return redirect(data.url);
  } else {
    console.error("No redirect URL returned from OAuth");
  }
}

export async function signInWithGitHub(redirectTo: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo,
    },
  });
  if (error) {
    console.error(error);
    // Handle error appropriately
    return;
  }
  if (data?.url) {
    return redirect(data.url);
  }
}
