import type { ExtractedStyleLibrary, UploadedDocument } from "@word-formatter/shared";

export async function getCapabilitySummary() {
  try {
    const response = await fetch("/api/health");
    if (!response.ok) {
      return null;
    }

    return response.json() as Promise<{ status: string; service: string }>;
  } catch {
    return null;
  }
}

export async function parseDocument(file: File): Promise<UploadedDocument> {
  const formData = new FormData();
  formData.append("document", file);

  const response = await fetch("/api/documents/parse", {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "文档解析失败");
  }

  return response.json() as Promise<UploadedDocument>;
}

export async function extractTemplateStyles(file: File): Promise<ExtractedStyleLibrary> {
  const formData = new FormData();
  formData.append("template", file);

  const response = await fetch("/api/documents/template/styles", {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "模板样式提取失败");
  }

  return response.json() as Promise<ExtractedStyleLibrary>;
}
