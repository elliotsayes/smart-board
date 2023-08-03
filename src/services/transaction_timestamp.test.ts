import { test, expect } from "vitest";
import { transactionTimestamp } from "./transaction_timestamp";

test("loads transaction timestamp", async () => {
  const txId = "-8A6RexFkpfWwuyVO98wzSFZh0d6VJuI-buTJvlwOJQ";

  const res = await transactionTimestamp(txId);

  expect(res).toEqual(1598537166);
});
