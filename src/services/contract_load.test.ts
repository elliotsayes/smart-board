import { test, expect } from "vitest";
import { WarpFactory } from "warp-contracts";
import { loadContractData } from "./contract_load";

test(
  "loads example contract",
  async () => {
    const warp = WarpFactory.forMainnet();
    const contractId = "bLAgYxAdX2Ry-nt6aH2ixgvJXbpsEYm28NgJgyqfs-U";
    const contractDataStream = loadContractData(warp, contractId);
    const contractDataStreamReader = contractDataStream.getReader();

    let result;
    let lastResult;
    while (!(result = await contractDataStreamReader.read()).done) {
      lastResult = result;
    }

    expect(lastResult).toBeDefined();
    expect(lastResult?.value?.meta).toBeDefined();
    expect(lastResult?.value?.initialState).toBeDefined();
    expect(lastResult?.value?.latestState).toBeDefined();
    expect(lastResult?.value?.interactionHistory).toBeDefined();
    expect(lastResult?.value?.stateHistory).toBeDefined();
    expect(lastResult?.value?.interactionCacheHistory).toBeDefined();
  },
  {
    timeout: 10000,
  }
);
