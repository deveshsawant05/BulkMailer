import { NextResponse } from "next/server";
import { google } from "googleapis";
import { createClient } from "@/utils/supabase/server";
import { encrypt } from "@worker/lib/encryption";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/settings?error=" + error, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/settings?error=no_code", request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/gmail/callback";

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/settings?error=missing_credentials", request.url));
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.redirect(new URL("/auth/login?redirect=/settings", request.url));
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    const { tokens } = await oauth2Client.getToken(code);
    
    oauth2Client.setCredentials(tokens);

    // Get user info to get the email address
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const userInfo = await oauth2.userinfo.get();
    const gmailEmail = userInfo.data.email;

    if (!gmailEmail) {
      throw new Error("Could not retrieve email address from Google.");
    }

    // Encrypt tokens
    const encryptedAccessToken = encrypt(tokens.access_token || "");
    const encryptedRefreshToken = encrypt(tokens.refresh_token || "");

    if (!encryptedAccessToken || !encryptedRefreshToken) {
      throw new Error("Failed to encrypt tokens.");
    }

    const payload = {
      user_id: user.id,
      gmail_email: gmailEmail,
      encrypted_access_token: encryptedAccessToken,
      encrypted_refresh_token: encryptedRefreshToken,
      token_expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
      scope: tokens.scope,
    };

    // Upsert the connection for the user
    // Depending on schema, maybe user can have multiple, but schema says `user_id` unique constraint
    const { error: dbError } = await supabase
      .from("gmail_connections")
      .upsert(payload, { onConflict: "user_id" });

    if (dbError) {
      console.error("DB Error saving gmail connection:", dbError);
      return NextResponse.redirect(new URL("/settings?error=db_error", request.url));
    }

    return NextResponse.redirect(new URL("/settings?success=gmail_connected", request.url));

  } catch (err) {
    console.error("OAuth callback error:", err);
    return NextResponse.redirect(new URL("/settings?error=oauth_failed", request.url));
  }
}
