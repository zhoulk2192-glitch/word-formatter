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
