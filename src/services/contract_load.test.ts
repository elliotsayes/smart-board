import { test, expect } from "vitest";
import { WarpFactory } from "warp-contracts";
import { loadContractData } from "./contract_load";
import * as fs from "node:fs";

test(
  "loads example contract, state matches",
  async () => {
    const contractId = "-8A6RexFkpfWwuyVO98wzSFZh0d6VJuI-buTJvlwOJQ";

    const warp1 = WarpFactory.forMainnet();
    const contract = warp1.contract(contractId);
    const contractState = await contract.readState();

    fs.writeFileSync(
      "./contract_load.latestState.readState.json.log",
      JSON.stringify(contractState.cachedValue.state, null, 2)
    );

    await warp1.close();
    fs.rmSync("./cache", { recursive: true, force: true });

    const warp2 = WarpFactory.forMainnet();
    const contractDataStream = loadContractData(warp2, contractId);
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

    await warp2.close();
    fs.rmSync("./cache", { recursive: true, force: true });

    expect(lastResult?.value.latestState?.cachedValue.state).toEqual(
      contractState.cachedValue.state
    );
  },
  {
    timeout: 30000,
  }
);
