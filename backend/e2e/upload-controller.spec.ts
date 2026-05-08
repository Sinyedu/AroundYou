import { expect, test } from "@playwright/test";
import { isAllowedUploadImageType } from "../src/controllers/uploadController";

test.describe("upload image validation", () => {
  test("allows supported image extensions when the MIME type matches", () => {
    expect(isAllowedUploadImageType("photo.png", "image/png")).toBe(true);
    expect(isAllowedUploadImageType("photo.jpg", "image/jpeg")).toBe(true);
    expect(isAllowedUploadImageType("photo.jpeg", "image/jpeg")).toBe(true);
    expect(isAllowedUploadImageType("photo.webp", "image/webp")).toBe(true);
  });

  test("rejects unsupported or mismatched image types", () => {
    expect(isAllowedUploadImageType("photo.gif", "image/gif")).toBe(false);
    expect(isAllowedUploadImageType("photo.svg", "image/svg+xml")).toBe(false);
    expect(isAllowedUploadImageType("photo.png", "image/jpeg")).toBe(false);
    expect(isAllowedUploadImageType("photo.webp", "image/png")).toBe(false);
  });
});
