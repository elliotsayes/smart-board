import { DefaultEvaluationOptions, Warp } from "warp-contracts";
import { ContractDataFull } from "../types/contract";

export const loadContractData = (
  warp: Warp,
  contractId: string
): ReadableStream<Partial<ContractDataFull>> => {
  return new ReadableStream({
    async start(controller) {
      let contractData: Partial<ContractDataFull> = {};

      const contract = warp.contract(contractId);

      const contractDefinition = await warp.definitionLoader.load(contractId);
      contractData = {
        meta: contractDefinition,
      };
      controller.enqueue(contractData);

      const handler = await warp.executorFactory.create(
        contractDefinition,
        new DefaultEvaluationOptions(),
        warp,
        contract.interactionState()
      );
      const initialExecutionContext = {
        warp,
        contract,
        contractDefinition,
        sortedInteractions: [],
        evaluationOptions: new DefaultEvaluationOptions(),
        handler,
        cachedState: undefined,
        // requestedSortKey: sorter.generateLastSortKey(519158),
      };
      const initialState = await warp.stateEvaluator.eval(
        initialExecutionContext
      );
      contractData = {
        ...contractData,
        initialState,
      };

      const sortedInteractions = await warp.interactionsLoader.load(contractId);
      contractData = {
        ...contractData,
        interactionHistory: sortedInteractions,
      };
      controller.enqueue(contractData);

      const currentExecutionContext = {
        warp,
        contract,
        contractDefinition,
        sortedInteractions,
        evaluationOptions: new DefaultEvaluationOptions(),
        handler,
        cachedState: undefined,
      };
      const stateHistory = await warp.stateEvaluator.evalHistory(
        currentExecutionContext
      );
      contractData = {
        ...contractData,
        latestState: stateHistory[stateHistory.length - 1],
        stateHistory,
      };
      controller.enqueue(contractData);

      controller.close();
    },
  });
};
