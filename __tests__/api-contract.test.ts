import { describe, it, expect } from "vitest";
import { ok, fail, ApiValidationError } from "@/lib/opentrust/api-contract";

describe("ok()", () => {
  it("wraps data in success envelope", () => {
    const result = ok({ foo: "bar" });
    expect(result.ok).toBe(true);
    expect(result.data).toEqual({ foo: "bar" });
  });

  it("works with null data", () => {
    const result = ok(null);
    expect(result.ok).toBe(true);
    expect(result.data).toBeNull();
  });
});

describe("fail()", () => {
  it("formats ApiValidationError with code and message", () => {
    const error = new ApiValidationError("Bad input", { code: "invalid_input", status: 400 });
    const result = fail(error);

    expect(result.ok).toBe(false);
    expect(result.error.code).toBe("invalid_input");
    expect(result.error.message).toBe("Bad input");
    expect(result.status).toBe(400);
  });

  it("includes details when provided", () => {
    const error = new ApiValidationError("Missing field", {
      code: "missing_field",
      details: { field: "title" },
    });
    const result = fail(error);
    expect(result.error.details).toEqual({ field: "title" });
  });

  it("returns internal_error for unknown errors", () => {
    const result = fail(new Error("something broke"));
    expect(result.ok).toBe(false);
    expect(result.error.code).toBe("internal_error");
    expect(result.status).toBe(500);
    // Should NOT leak the original error message
    expect(result.error.message).not.toContain("something broke");
  });

  it("handles non-Error thrown values", () => {
    const result = fail("string error");
    expect(result.ok).toBe(false);
    expect(result.error.code).toBe("internal_error");
  });
});

describe("ApiValidationError", () => {
  it("defaults to status 400 and code invalid_request", () => {
    const error = new ApiValidationError("test");
    expect(error.status).toBe(400);
    expect(error.code).toBe("invalid_request");
    expect(error.name).toBe("ApiValidationError");
  });

  it("accepts custom status and code", () => {
    const error = new ApiValidationError("forbidden", { status: 403, code: "forbidden" });
    expect(error.status).toBe(403);
    expect(error.code).toBe("forbidden");
  });
});
