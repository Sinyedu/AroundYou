import { Request, Response } from "express";

export function visibleFilter(req: Request): Record<string, unknown> {
  if (!req.originalUrl.startsWith("/api/admin/")) {
    return { isHidden: { $ne: true } };
  }

  if (req.query.visibility === "hidden") {
    return { isHidden: true };
  }

  if (req.query.visibility === "all") {
    return {};
  }

  return { isHidden: { $ne: true } };
}

export function getHideUpdate(hiddenBy?: string): Record<string, unknown> {
  return {
    isHidden: true,
    hiddenAt: new Date(),
    hiddenBy,
  };
}

export function getRestoreUpdate(): Record<string, unknown> {
  return {
    isHidden: false,
    $unset: { hiddenAt: "", hiddenBy: "" },
  };
}

export function isValidationError(error: unknown): error is Error {
  return error instanceof Error && error.name === "ValidationError";
}

export function sendCreateError(
  res: Response,
  error: unknown,
  fallbackMessage: string,
): void {
  if (isValidationError(error)) {
    res.status(400).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: fallbackMessage });
}

export function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/æ/g, "a")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
