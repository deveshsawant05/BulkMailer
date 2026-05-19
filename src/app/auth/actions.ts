"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function verifyOTP(email: string, token: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    if (error) {
      return { success: false, error: error.message };
    }
    revalidatePath("/", "layout");
    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error during OTP verification:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function sendOTP(email: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      return { success: false, error: error.message };
    }
    revalidatePath("/", "layout");
    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error during OTP resend:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function forgotPassword(email: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      return { success: false, error: error.message };
    }
    revalidatePath("/", "layout");
    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error during password reset:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function updatePassword(newPassword: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      return { success: false, error: error.message };
    }
    revalidatePath("/", "layout");
    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error during password update:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
