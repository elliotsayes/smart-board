// sum.test.js
import { test, expect } from "vitest";
import "@vitest/web-worker";
import ContractLoadWorker from "./contract_load_worker?worker";
import { WorkerResponse } from "../types/worker";
import { ContractDataFull } from "../types/contract";

test("loads example contract", async () => {
  const contractId = "aeQgDoPgdixT7tjNXC9X4x6NRjGjAmsvUndl3_EHlto";

  const runContractWorker = new Promise<Partial<ContractDataFull>>(
    (resolve) => {
      let contractData: Partial<ContractDataFull> = {};

      const contractLoadWorker = new ContractLoadWorker();
      contractLoadWorker.onmessage = (e) => {
        console.log("Message received from worker");
        const workerResponse = e.data as WorkerResponse<
          Partial<ContractDataFull>
        >;
        if (workerResponse.type === "result") {
          console.log(workerResponse);
          contractData = workerResponse.result;
        } else if (workerResponse.type === "done") {
          contractLoadWorker.terminate();
          resolve(contractData);
        }
      };

      contractLoadWorker.postMessage(contractId);
    }
  );

  const contractData = await runContractWorker;
  expect(contractData.meta).toBeDefined();
  expect(contractData.initialState).toBeDefined();
  expect(contractData.latestState).toBeDefined();
  expect(contractData.interactionHistory).toBeDefined();
  expect(contractData.stateHistory).toBeDefined();
});
