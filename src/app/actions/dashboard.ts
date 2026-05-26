"use server";

import { createClient } from "@/utils/supabase/server";

async function getAuthenticatedUserId() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("You must be signed in to view dashboard data.");
  }

  return { supabase, userId: user.id };
}

export async function getDashboardStats() {
  try {
    const { supabase, userId } = await getAuthenticatedUserId();

    // Total campaigns
    const { count: totalCampaigns } = await supabase
      .from("campaigns")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    // Active campaigns (PROCESSING or QUEUED)
    const { count: activeCampaigns } = await supabase
      .from("campaigns")
      .select("*", { count: "exact", head: true })
      .in("status", ["PROCESSING", "QUEUED"])
      .eq("user_id", userId);

    // Total templates
    const { count: totalTemplates } = await supabase
      .from("templates")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    // Total recipients (sum of recipient_count)
    // Supabase JS doesn't have a direct sum function without RPC, so we fetch the counts and sum in JS
    const { data: campaigns } = await supabase
      .from("campaigns")
      .select("recipient_count")
      .eq("user_id", userId);

    const totalRecipients = campaigns?.reduce((sum, campaign) => sum + (campaign.recipient_count || 0), 0) || 0;

    return {
      success: true,
      data: {
        totalCampaigns: totalCampaigns || 0,
        activeCampaigns: activeCampaigns || 0,
        totalTemplates: totalTemplates || 0,
        totalRecipients,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load dashboard stats.",
    };
  }
}

export async function getRecentCampaigns(limit = 5) {
  try {
    const { supabase, userId } = await getAuthenticatedUserId();

    const { data, error } = await supabase
      .from("campaigns")
      .select("*, templates(name)")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (error) {
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data ?? [] };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Failed to load recent campaigns.",
    };
  }
}

export async function getRecentTemplates(limit = 5) {
  try {
    const { supabase, userId } = await getAuthenticatedUserId();

    const { data, error } = await supabase
      .from("templates")
      .select("id, name, description, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (error) {
      return { success: false, error: error.message, data: [] };
    }

    // Since we don't have a direct join for template usage count without a more complex query,
    // we fetch the usage count for each template
    const templateIds = data?.map((t) => t.id) || [];
    let usageCounts: Record<string, number> = {};

    if (templateIds.length > 0) {
        const { data: campaignUsage } = await supabase
        .from("campaigns")
        .select("template_id")
        .in("template_id", templateIds);
        
        usageCounts = (campaignUsage || []).reduce((acc: Record<string, number>, curr) => {
            if (curr.template_id) {
                acc[curr.template_id] = (acc[curr.template_id] || 0) + 1;
            }
            return acc;
        }, {});
    }

    const enhancedData = data?.map((t) => ({
      ...t,
      usage_count: usageCounts[t.id] || 0,
    })) ?? [];

    return { success: true, data: enhancedData };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Failed to load recent templates.",
    };
  }
}
