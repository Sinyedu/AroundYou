import { expect, test, type APIResponse } from "@playwright/test";

async function expectJsonResponse(response: APIResponse) {
  expect(response.headers()["content-type"]).toContain("application/json");
  return response.json();
}

test.describe("AroundYou API", () => {
  test("serves a basic API health response", async ({ request }) => {
    const response = await request.get("/api");

    expect(response.status()).toBe(200);
    await expect(response.text()).resolves.toBe("Welcome to the AroundYou API");
  });

  test("returns public collection endpoints as JSON arrays", async ({ request }) => {
    const endpoints = ["/api/city", "/api/events", "/api/attractions"];

    for (const endpoint of endpoints) {
      const response = await request.get(endpoint);
      const body = await expectJsonResponse(response);

      expect(response.status(), `${endpoint} status`).toBe(200);
      expect(Array.isArray(body), `${endpoint} response body`).toBe(true);
    }
  });

  test("returns not found for a missing city id", async ({ request }) => {
    const missingMongoId = "000000000000000000000000";
    const response = await request.get(`/api/city/${missingMongoId}`);
    const body = await expectJsonResponse(response);

    expect(response.status()).toBe(404);
    expect(body.message).toBe("City not found");
  });

  test("rejects protected endpoints without a bearer token", async ({ request }) => {
    const response = await request.get("/api/user/me");
    const body = await expectJsonResponse(response);

    expect(response.status()).toBe(401);
    expect(body.message).toBe("No token provided");
  });

  test("rejects malformed login requests before authentication", async ({ request }) => {
    const response = await request.post("/api/user/login", {
      data: {
        identifier: "",
        password: "123",
      },
    });
    const body = await expectJsonResponse(response);

    expect(response.status()).toBe(400);
    expect(body.message).toEqual(expect.any(String));
  });

  test("rejects invalid credentials without issuing a token", async ({ request }) => {
    const response = await request.post("/api/user/login", {
      data: {
        identifier: "not-a-real-user@example.com",
        password: "password123",
      },
    });
    const body = await expectJsonResponse(response);

    expect(response.status()).toBe(401);
    expect(body.message).toBe("Invalid credentials");
    expect(body.token).toBeUndefined();
  });

  test("rejects invalid registration payloads without creating users", async ({ request }) => {
    const response = await request.post("/api/user/register", {
      data: {
        firstName: "A",
        lastName: "",
        userName: "",
        email: "not-an-email",
        password: "123",
      },
    });
    const body = await expectJsonResponse(response);

    expect(response.status()).toBe(400);
    expect(body.message).toEqual(expect.any(String));
  });
});
