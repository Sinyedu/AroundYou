import { expect, test, type APIResponse } from "@playwright/test";

async function expectJsonResponse(response: APIResponse) {
  expect(response.headers()["content-type"]).toContain("application/json");
  return response.json();
}

test.describe("AroundYou API", () => {
  test("serves a basic API health response", async ({ request }) => {
    const response = await request.get("/");

    expect(response.status()).toBe(200);
    await expect(response.text()).resolves.toBe("Welcome to the AroundYou API");
  });

  test("returns public collection endpoints as JSON arrays", async ({ request }) => {
    const endpoints = ["/city", "/events", "/attractions"];

    for (const endpoint of endpoints) {
      const response = await request.get(endpoint);
      const body = await expectJsonResponse(response);

      expect(response.status(), `${endpoint} status`).toBe(200);
      expect(Array.isArray(body), `${endpoint} response body`).toBe(true);
    }
  });

  test("can look up a returned city by id", async ({ request }) => {
    const listResponse = await request.get("/city");
    const cities = await expectJsonResponse(listResponse);

    expect(listResponse.status()).toBe(200);
    test.skip(cities.length === 0, "No cities are available in the test database.");

    const firstCity = cities[0];
    expect(firstCity._id).toEqual(expect.any(String));

    const detailResponse = await request.get(`/city/${firstCity._id}`);
    const detail = await expectJsonResponse(detailResponse);

    expect(detailResponse.status()).toBe(200);
    expect(detail._id).toBe(firstCity._id);
    expect(detail.name).toBe(firstCity.name);
  });

  test("rejects protected endpoints without a bearer token", async ({ request }) => {
    const response = await request.get("/user/me");
    const body = await expectJsonResponse(response);

    expect(response.status()).toBe(401);
    expect(body.message).toBe("No token provided");
  });

  test("rejects malformed login requests before authentication", async ({ request }) => {
    const response = await request.post("/user/login", {
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
    const response = await request.post("/user/login", {
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
    const response = await request.post("/user/register", {
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
