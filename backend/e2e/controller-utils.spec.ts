import { expect, test } from "@playwright/test";
import { Request, Response } from "express";

import {
  getHideUpdate,
  getRestoreUpdate,
  isValidationError,
  normalizeSlug,
  sendCreateError,
  visibleFilter,
} from "../src/controllers/controllerUtils";

type ResponseCapture = {
  body?: unknown;
  statusCode?: number;
};

function requestStub(originalUrl: string, query: Request["query"] = {}): Request {
  return {
    originalUrl,
    query,
  } as Request;
}

function responseStub(capture: ResponseCapture): Response {
  return {
    status(code: number) {
      capture.statusCode = code;
      return this;
    },
    json(body: unknown) {
      capture.body = body;
      return this;
    },
  } as Response;
}

test.describe("controller utils", () => {
  test("builds public and admin visibility filters", () => {
    expect(visibleFilter(requestStub("/api/city"))).toEqual({
      isHidden: { $ne: true },
    });

    expect(
      visibleFilter(requestStub("/api/admin/city", { visibility: "hidden" })),
    ).toEqual({ isHidden: true });
    expect(
      visibleFilter(requestStub("/api/admin/city", { visibility: "all" })),
    ).toEqual({});
    expect(visibleFilter(requestStub("/api/admin/city"))).toEqual({
      isHidden: { $ne: true },
    });
  });

  test("builds soft-delete and restore updates consistently", () => {
    const before = Date.now();
    const hideUpdate = getHideUpdate("user-123");
    const after = Date.now();

    expect(hideUpdate.isHidden).toBe(true);
    expect(hideUpdate.hiddenBy).toBe("user-123");
    expect(hideUpdate.hiddenAt).toBeInstanceOf(Date);
    expect((hideUpdate.hiddenAt as Date).getTime()).toBeGreaterThanOrEqual(before);
    expect((hideUpdate.hiddenAt as Date).getTime()).toBeLessThanOrEqual(after);

    expect(getRestoreUpdate()).toEqual({
      isHidden: false,
      $unset: { hiddenAt: "", hiddenBy: "" },
    });
  });

  test("normalizes slugs consistently for Danish city route matching", () => {
    expect(normalizeSlug("København Ø")).toBe("kobenhavn-o");
    expect(normalizeSlug("Aarhus / Åbyen")).toBe("aarhus-abyen");
    expect(normalizeSlug("  Ærøskøbing!!! ")).toBe("aroskobing");
  });

  test("maps validation and unknown create errors to API responses", () => {
    const validationError = new Error("City validation failed");
    validationError.name = "ValidationError";

    expect(isValidationError(validationError)).toBe(true);

    const validationCapture: ResponseCapture = {};
    sendCreateError(responseStub(validationCapture), validationError, "Fallback");

    expect(validationCapture.statusCode).toBe(400);
    expect(validationCapture.body).toEqual({ message: "City validation failed" });

    const fallbackCapture: ResponseCapture = {};
    sendCreateError(
      responseStub(fallbackCapture),
      new Error("Database down"),
      "Could not create record",
    );

    expect(fallbackCapture.statusCode).toBe(500);
    expect(fallbackCapture.body).toEqual({ message: "Could not create record" });
  });
});
