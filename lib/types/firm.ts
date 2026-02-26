import type { Case } from "../mock-cases";

export interface Advocate {
  name: string;
  enrollment: string;
}

export interface FirmProfile {
  firmName: string;
  tagline: string;
  seniorAdvocate: Advocate;
  associates: Advocate[];
  address: string;
  phone: string;
  email: string;
}

export interface OpinionTemplatePlaceholder {
  name: string;
  label: string;
  fieldType: "text" | "textarea" | "date" | "number";
}

export interface OpinionTemplate {
  id: string;
  name: string;
  bankName: string;
  notes: string;
  placeholders: OpinionTemplatePlaceholder[];
  fileSizeBytes: number;
  originalFileName: string;
  createdAt: string;
}

export interface CourtHearing {
  date: string;
  purpose: string;
  judge: string;
}

export interface CourtOrder {
  date: string;
  details: string;
}

export interface CourtDataCache {
  lastSynced: string;
  caseStatus: string;
  nextHearingDate: string;
  courtAndJudge: string;
  petitioners: string;
  respondents: string;
  filingDate: string;
  registrationNumber: string;
  registrationDate: string;
  firstHearingDate: string;
  caseHistory: CourtHearing[];
  orders: CourtOrder[];
}

export interface FirmData {
  profile: FirmProfile;
  cases: Case[];
  customInstructions: string;
  opinionTemplates: OpinionTemplate[];
}
