import assert from "node:assert/strict";
import test from "node:test";
import { decodeBase64, encodeBase64 } from "../src/base64.js";

test("encodes and decodes ASCII text", () => {
  const encoded = encodeBase64("hello world");
  assert.equal(encoded, "aGVsbG8gd29ybGQ=");
  assert.equal(decodeBase64(encoded), "hello world");
});

test("preserves Unicode text", () => {
  const source = "Zażółć gęślą jaźń";
  assert.equal(decodeBase64(encodeBase64(source)), source);
});

test("supports unpadded URL-safe Base64", () => {
  const encoded = encodeBase64("subjects?_d", true);
  assert.doesNotMatch(encoded, /[+/=]/);
  assert.equal(decodeBase64(encoded), "subjects?_d");
});

test("rejects invalid Base64 characters", () => {
  assert.throws(() => decodeBase64("not base64!"), /invalid Base64/);
});
