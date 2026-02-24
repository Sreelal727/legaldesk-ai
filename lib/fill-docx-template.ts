import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import { getTemplateFile } from "./template-store";

export async function fillAndDownloadTemplate(
  templateId: string,
  values: Record<string, string>,
  filename: string
): Promise<void> {
  const buffer = await getTemplateFile(templateId);
  if (!buffer) throw new Error("Template file not found in IndexedDB");

  const zip = new PizZip(buffer);
  const doc = new Docxtemplater(zip, {
    delimiters: { start: "{{", end: "}}" },
    paragraphLoop: true,
    linebreaks: true,
    nullGetter: () => "",
  });

  doc.render(values);

  const out = doc.getZip().generate({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  saveAs(out, filename.endsWith(".docx") ? filename : `${filename}.docx`);
}
