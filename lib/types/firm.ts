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

export interface FirmData {
  profile: FirmProfile;
  cases: Case[];
  customInstructions: string;
  opinionTemplates: OpinionTemplate[];
}
