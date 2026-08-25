import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getServiceSupabase } from "@/lib/ai/analytics";

const CRM_SECRET = process.env.CRM_WEBHOOK_SECRET || "default_dev_secret_key";

/**
 * Webhook for integrating with external CRM (e.g. Jobber, AmoCRM)
 * Features:
 * - HMAC SHA-256 signature validation
 * - Anti-echo loop protection using a TTL cache or DB tracking
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-crm-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    // 1. Verify HMAC Signature
    const expectedSignature = crypto
      .createHmac("sha256", CRM_SECRET)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const payload = JSON.parse(rawBody);

    // 2. Anti-Echo Idempotency Guard (Event tracking in Supabase to prevent processing the same webhook twice)
    const eventId = payload.event_id || payload.id;
    if (!eventId) {
      return NextResponse.json({ error: "Missing event_id in payload" }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    if (supabase) {
      // Create a table 'webhook_events' or use 'analytics' to track processed events
      // For now, we will track this in a hypothetical 'webhook_events' table.
      // If the row exists, it will throw a unique constraint error or we can upsert and ignore.
      
      const { error: insertError } = await supabase
        .from('zhaluzi_webhook_events')
        .insert([{ id: eventId, event_type: payload.type, payload, processed_at: new Date().toISOString() }]);

      if (insertError) {
        if (insertError.code === '23505') { // Postgres Unique Violation
          console.warn(`Anti-Echo: Webhook event ${eventId} already processed. Ignoring.`);
          return NextResponse.json({ status: "ignored", reason: "duplicate_event" });
        }
        console.error("Supabase webhook logging error:", insertError);
      }
    }

    // 3. Process the CRM event (e.g. update lead status, notify user)
    console.log(`Processing CRM event: ${payload.type} for lead: ${payload.lead_id}`);
    
    // TODO: Implement specific CRM syncing logic here based on payload.type

    return NextResponse.json({ status: "success", eventId });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
