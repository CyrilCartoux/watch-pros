import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const listingId = params.id;

  // Récupère l'user (si connecté)
  const { data: { user } } = await supabase.auth.getUser();

  // Récupère l'IP (X-Forwarded-For ou remote)
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.ip || "";
  const userAgent = req.headers.get("user-agent") || "";

  // Hash IP+UA pour anonymiser
  const ipHash = !user ? crypto.createHash("sha256").update(ip + userAgent).digest("hex") : null;

  // Date limite (24h)
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Vérifie si une vue existe déjà dans les 24h
  let existingView;
  if (user) {
    const { data } = await supabase
      .from("listing_views")
      .select("id")
      .eq("listing_id", listingId)
      .eq("user_id", user.id)
      .gte("created_at", since)
      .maybeSingle();
    existingView = data;
  } else {
    const { data } = await supabase
      .from("listing_views")
      .select("id")
      .eq("listing_id", listingId)
      .eq("ip_hash", ipHash)
      .gte("created_at", since)
      .maybeSingle();
    existingView = data;
  }

  if (existingView) {
    return NextResponse.json({ viewed: false, reason: "Already viewed recently" }, { status: 200 });
  }

  // Insert la vue
  await supabase.from("listing_views").insert({
    listing_id: listingId,
    user_id: user ? user.id : null,
    ip_hash: ipHash,
    user_agent: userAgent,
  });

  // Incrémente le compteur (fonction SQL à créer)
  await supabase.rpc("increment_listing_views_count", { listing_id: listingId });

  return NextResponse.json({ viewed: true });
} 