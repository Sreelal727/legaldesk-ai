import type { FirmData, FirmProfile } from "./types/firm";
import { mockCases } from "./mock-cases";

const STORAGE_KEY = "legaldesk-firm-data";

export function getDefaultFirmData(): FirmData {
  return {
    profile: {
      firmName: "Nair & Associates",
      tagline: "Advocates & Legal Consultants",
      seniorAdvocate: {
        name: "Adv. Priya Nair",
        enrollment: "KER/2015/4567",
      },
      associates: [
        { name: "Adv. Deepa Mohan", enrollment: "KER/2018/7890" },
      ],
      address: "3rd Floor, Legal Chambers, MG Road, Ernakulam, Kerala - 682011",
      phone: "+91 484 2345678",
      email: "office@nairassociates.in",
    },
    cases: mockCases,
    customInstructions: "",
    opinionTemplates: [],
  };
}

export function loadFirmData(): FirmData {
  if (typeof window === "undefined") return getDefaultFirmData();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const defaults = getDefaultFirmData();
      saveFirmData(defaults);
      return defaults;
    }
    const data = JSON.parse(stored) as FirmData;
    if (!data.opinionTemplates) data.opinionTemplates = [];
    // Backward compat: add cnrNumber to cases that don't have it
    if (data.cases) {
      for (const c of data.cases) {
        if (c.cnrNumber === undefined) c.cnrNumber = "";
      }
    }
    return data;
  } catch {
    return getDefaultFirmData();
  }
}

export function saveFirmData(data: FirmData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable
  }
}

export function exportFirmData(): string {
  return JSON.stringify(loadFirmData(), null, 2);
}

export function importFirmData(json: string): FirmData {
  const data = JSON.parse(json) as FirmData;
  saveFirmData(data);
  return data;
}
