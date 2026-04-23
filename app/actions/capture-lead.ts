"use server";

import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

interface CaptureLeadInput {
  email: string;
  calculatorSlug: string;
  inputSnapshot: Record<string, unknown>;
  resultSnapshot: Record<string, unknown>;
}

export async function captureLead(input: CaptureLeadInput) {
  const { email, calculatorSlug, inputSnapshot, resultSnapshot } = input;

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Invalid email address" };
  }

  // Get geo from Vercel headers
  const headersList = await headers();
  const ipCountry = headersList.get("x-vercel-ip-country") || null;
  const ipProvince =
    headersList.get("x-vercel-ip-country-region") || null;
  const referrer = headersList.get("referer") || null;

  const { error } = await supabaseAdmin.from("calculator_leads").insert({
    email,
    calculator_slug: calculatorSlug,
    input_snapshot: inputSnapshot,
    result_snapshot: resultSnapshot,
    ip_country: ipCountry,
    ip_province: ipProvince,
    referrer,
    consent_marketing: false,
  });

  if (error) {
    console.error("Failed to capture lead:", error);
    return { success: false, error: "Failed to save. Please try again." };
  }

  return { success: true };
}
