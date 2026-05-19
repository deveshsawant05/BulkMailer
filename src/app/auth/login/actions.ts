"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error("Login error:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/");
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
    console.error("Error during Google OAuth sign-in:", error.message);
    return { success: false, error: error.message };
  }

  if (data?.url) {
    return redirect(data.url);
  } else {
    console.error("No redirect URL returned from OAuth");
  }
}

export async function logout(redirectFlag?: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error("Error during sign-out:", error);
    return { success: false, error: error.message };
  }
 
  revalidatePath("/", "layout");
  if (redirectFlag) {
    redirect("/auth/login");
  }
  console.log("User logged out successfully");
  return { success: true };
}