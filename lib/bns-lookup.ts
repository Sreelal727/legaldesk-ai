import mappingData from "../ipc_bns_mapping.json";

export interface SectionEntry {
  ipcSection: string;
  ipcTitle: string;
  bnsSection: string;
  bnsTitle: string;
  changes: string;
  category: string;
}

const data: SectionEntry[] = mappingData;

export function lookupByIPC(section: string): SectionEntry[] {
  const normalized = section.replace(/\s+/g, "").toUpperCase();
  return data.filter((entry) => {
    const entryNorm = entry.ipcSection.replace(/\s+/g, "").toUpperCase();
    return entryNorm === normalized || entryNorm.startsWith(normalized);
  });
}

export function lookupByBNS(section: string): SectionEntry[] {
  const normalized = section.replace(/\s+/g, "").toUpperCase();
  return data.filter((entry) => {
    const entryNorm = entry.bnsSection.replace(/\s+/g, "").toUpperCase();
    return entryNorm === normalized || entryNorm.startsWith(normalized);
  });
}

export function searchByKeyword(keyword: string): SectionEntry[] {
  const lower = keyword.toLowerCase();
  return data.filter(
    (entry) =>
      entry.ipcTitle.toLowerCase().includes(lower) ||
      entry.bnsTitle.toLowerCase().includes(lower) ||
      entry.category.toLowerCase().includes(lower) ||
      entry.changes.toLowerCase().includes(lower)
  );
}

export function getByCategory(category: string): SectionEntry[] {
  const lower = category.toLowerCase();
  return data.filter((entry) =>
    entry.category.toLowerCase().includes(lower)
  );
}

export function getNewBNSSections(): SectionEntry[] {
  return data.filter((entry) => entry.ipcSection === "NEW");
}

export function getRepealedSections(): SectionEntry[] {
  return data.filter(
    (entry) => entry.bnsSection === "Repealed" || entry.bnsSection === "REPEALED"
  );
}

export function getAllCategories(): string[] {
  return [...new Set(data.map((entry) => entry.category))];
}
