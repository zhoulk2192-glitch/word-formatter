export function halfPointsToPoints(value: unknown): number | undefined {
  const numeric = toNumber(value);
  return numeric == null ? undefined : numeric / 2;
}

export function twentiethsToPoints(value: unknown): number | undefined {
  const numeric = toNumber(value);
  return numeric == null ? undefined : numeric / 20;
}

export function emuTwipsToPoints(value: unknown): number | undefined {
  return twentiethsToPoints(value);
}

export function lineValueToMultiple(value: unknown): number | undefined {
  const numeric = toNumber(value);
  return numeric == null ? undefined : Number((numeric / 240).toFixed(2));
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}
