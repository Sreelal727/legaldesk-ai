import { NextResponse } from "next/server";

export const maxDuration = 30;

// Supported provider configurations
const PROVIDERS: Record<string, { baseUrl: string; buildUrl: (cnr: string) => string; buildHeaders: (key: string) => Record<string, string> }> = {
  kleopatra: {
    baseUrl: "https://court-api.kleopatra.io",
    buildUrl: (cnr) => `https://court-api.kleopatra.io/api/district-court/case/${cnr}`,
    buildHeaders: (key) => ({
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    }),
  },
  surepass: {
    baseUrl: "https://kyc-api.surepass.io",
    buildUrl: () => `https://kyc-api.surepass.io/api/v1/ecourt/cnr`,
    buildHeaders: (key) => ({
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json",
    }),
  },
  custom: {
    baseUrl: "",
    buildUrl: (cnr) => {
      const base = process.env.ECOURTS_BASE_URL || "";
      return `${base}/case/${cnr}`;
    },
    buildHeaders: (key) => ({
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    }),
  },
};

// Normalize different API response formats into our standard shape
function normalizeResponse(provider: string, data: Record<string, unknown>): Record<string, unknown> {
  // Each provider may return data differently — normalize here
  // This is the adapter layer that makes swapping providers seamless
  const result = data?.data ?? data?.result ?? data?.case ?? data ?? {};
  const r = result as Record<string, unknown>;

  return {
    caseStatus: r.case_status ?? r.caseStatus ?? r.status ?? r.case_stage ?? "",
    nextHearingDate: r.next_hearing_date ?? r.nextHearingDate ?? r.next_date ?? "",
    courtAndJudge: r.court_number_and_judge ?? r.courtAndJudge ?? r.judge ?? r.court_no ?? "",
    petitioners: r.petitioner ?? r.petitioners ?? r.petitioner_name ?? "",
    respondents: r.respondent ?? r.respondents ?? r.respondent_name ?? "",
    filingDate: r.filing_date ?? r.filingDate ?? r.date_of_filing ?? "",
    registrationNumber: r.registration_number ?? r.registrationNumber ?? r.reg_no ?? "",
    registrationDate: r.registration_date ?? r.registrationDate ?? r.date_of_registration ?? "",
    firstHearingDate: r.first_hearing_date ?? r.firstHearingDate ?? "",
    caseHistory: normalizeHistory(r.case_history ?? r.caseHistory ?? r.history ?? []),
    orders: normalizeOrders(r.orders ?? r.order_details ?? r.interim_orders ?? []),
  };
}

function normalizeHistory(history: unknown): { date: string; purpose: string; judge: string }[] {
  if (!Array.isArray(history)) return [];
  return history.slice(0, 20).map((h: Record<string, unknown>) => ({
    date: String(h.hearing_date ?? h.date ?? h.business_date ?? ""),
    purpose: String(h.purpose ?? h.purpose_of_hearing ?? h.business ?? ""),
    judge: String(h.judge ?? h.court_no ?? h.judge_name ?? ""),
  }));
}

function normalizeOrders(orders: unknown): { date: string; details: string }[] {
  if (!Array.isArray(orders)) return [];
  return orders.slice(0, 10).map((o: Record<string, unknown>) => ({
    date: String(o.order_date ?? o.date ?? ""),
    details: String(o.order_details ?? o.details ?? o.order ?? ""),
  }));
}

export async function POST(req: Request) {
  try {
    const { cnrNumber } = await req.json();

    if (!cnrNumber || typeof cnrNumber !== "string") {
      return NextResponse.json({ error: "CNR number is required" }, { status: 400 });
    }

    const apiKey = process.env.ECOURTS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ECOURTS_API_KEY not configured. Add it in Vercel Environment Variables." },
        { status: 503 }
      );
    }

    const provider = (process.env.ECOURTS_PROVIDER || "kleopatra").toLowerCase();
    const config = PROVIDERS[provider] ?? PROVIDERS.kleopatra;

    const url = config.buildUrl(cnrNumber.trim());
    const headers = config.buildHeaders(apiKey);

    // For SurePass, the CNR goes in the body
    const fetchOptions: RequestInit = {
      method: provider === "surepass" ? "POST" : "GET",
      headers,
      ...(provider === "surepass" ? { body: JSON.stringify({ id_number: cnrNumber.trim() }) } : {}),
    };

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return NextResponse.json(
        {
          error: `API returned ${response.status}`,
          details: text.slice(0, 500),
          provider,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const normalized = normalizeResponse(provider, data);

    return NextResponse.json({
      success: true,
      provider,
      cnrNumber: cnrNumber.trim(),
      data: normalized,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch court data", details: String(error) },
      { status: 500 }
    );
  }
}
