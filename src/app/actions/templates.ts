"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/utils/supabase/server";

type TemplateInput = {
  name?: string;
  description?: string;
  subject_template?: string;
  body_template?: string;
};

async function getAuthenticatedUserId() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("You must be signed in to manage templates.");
  }

  return { supabase, userId: user.id };
}

function normalizeTemplateInput(input: TemplateInput) {
  return {
    name: input.name?.trim() ?? "",
    description: input.description?.trim() ?? "",
    subject_template: input.subject_template?.trim() ?? "",
    body_template: input.body_template ?? "",
  };
}

export async function createTemplate(input: TemplateInput) {
  try {
    const { supabase, userId } = await getAuthenticatedUserId();
    const template = normalizeTemplateInput(input);

    if (!template.name || !template.subject_template || !template.body_template) {
      return {
        success: false,
        error: "Template name, subject, and body are required.",
      };
    }

    const { data, error } = await supabase
      .from("templates")
      .insert({
        user_id: userId,
        ...template,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/templates");

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create template.",
    };
  }
}

export async function getTemplates() {
  try {
    const { supabase, userId } = await getAuthenticatedUserId();

    const { data, error } = await supabase
      .from("templates")
      .select(
        "id, user_id, name, description, subject_template, body_template, created_at, updated_at"
      )
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data ?? [] };
  } catch (error) {
    return {
      success: false,
      data: [],
      error:
        error instanceof Error ? error.message : "Failed to load templates.",
    };
  }
}

export async function getTemplateById(id: string) {
  try {
    const { supabase, userId } = await getAuthenticatedUserId();

    const { data, error } = await supabase
      .from("templates")
      .select(
        "id, user_id, name, description, subject_template, body_template, created_at, updated_at"
      )
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      return { success: false, error: error.message, data: null };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to load template.",
    };
  }
}

export async function updateTemplate(id: string, input: TemplateInput) {
  try {
    const { supabase, userId } = await getAuthenticatedUserId();
    const template = normalizeTemplateInput(input);

    if (!template.name || !template.subject_template || !template.body_template) {
      return {
        success: false,
        error: "Template name, subject, and body are required.",
      };
    }

    const { data, error } = await supabase
      .from("templates")
      .update(template)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/templates");
    revalidatePath(`/templates/${id}/edit`);

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update template.",
    };
  }
}

export async function deleteTemplate(id: string) {
  try {
    const { supabase, userId } = await getAuthenticatedUserId();

    const { error } = await supabase
      .from("templates")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/templates");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete template.",
    };
  }
}
