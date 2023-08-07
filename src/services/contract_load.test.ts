import { test, expect } from "vitest";
import { WarpFactory } from "warp-contracts";
import { loadContractData } from "./contract_load";
import * as fs from "node:fs";

test(
  "loads example contract, state matches",
  async () => {
    const warp = WarpFactory.forMainnet();
    const contractId = "-8A6RexFkpfWwuyVO98wzSFZh0d6VJuI-buTJvlwOJQ";
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
    expect(lastResult?.value?.interactionWithResultHistory).toBeDefined();

    fs.writeFileSync(
      "./contract_load.latestState.history.json.log",
      JSON.stringify(lastResult?.value.latestState?.cachedValue.state, null, 2)
    );

    await warp.close();
    fs.rmSync("./cache", { recursive: true, force: true });

    const warp2 = WarpFactory.forMainnet();
    const contract = warp2.contract(contractId);
    const contractState = await contract.readState();

    fs.writeFileSync(
      "./contract_load.latestState.readState.json.log",
      JSON.stringify(contractState.cachedValue.state, null, 2)
    );

    expect(lastResult?.value.latestState?.cachedValue.state).toEqual(
      contractState.cachedValue.state
    );

    await warp2.close();
    fs.rmSync("./cache", { recursive: true, force: true });
  },
  {
    timeout: 30000,
  }
);
