import { WarpFactory } from "warp-contracts";
import { loadContractData } from "./contract_load";
import { WorkerResponse } from "../types/worker";
import { ContractDataFull } from "../types/contract";

self.onmessage = function (e: MessageEvent) {
  (async () => {
    const warp = WarpFactory.forMainnet();
    const contractId = e.data as string;
    const contractData = loadContractData(warp, contractId);
    const contractDataReader = contractData.getReader();
    let result;
    while (!(result = await contractDataReader.read()).done) {
      const message: WorkerResponse<Partial<ContractDataFull>> = {
        type: "result",
        result: result.value,
      };
      postMessage(message);
    }
  })().finally(() => {
    postMessage({ type: "done" } as WorkerResponse<unknown>);
  });
};
