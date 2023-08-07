import { DefaultEvaluationOptions, Warp } from "warp-contracts";
import { transactionTimestamp } from "./transaction_timestamp";
import {
  ContractDataFull,
  ContractInteractionWithResultHistory,
  ContractInteractionResult,
  ContractInteractionHistory,
} from "../types/contract";

export const loadContractData = (
  warp: Warp,
  contractId: string
): ReadableStream<Partial<ContractDataFull>> => {
  return new ReadableStream({
    async start(controller) {
      let contractData: Partial<ContractDataFull> = {};

      const contract = warp.contract(contractId);

      const [contractDefinition, timestamp] = await Promise.all([
        warp.definitionLoader.load(contractId),
        transactionTimestamp(contractId),
      ]);
      const contractMeta = {
        ...contractDefinition,
        timestamp,
      };
      contractData = {
        // ...contractData,
        meta: contractMeta,
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
      const interactionHistory: ContractInteractionHistory =
        sortedInteractions.map((interaction) => {
          const inputString = interaction.tags.find(
            (tag) => tag.name == "Input"
          )?.value;
          const functionName =
            inputString &&
            (() => {
              try {
                return JSON.parse(inputString)["function"] as string;
              } catch {
                return undefined;
              }
            })();
          return {
            ...interaction,
            inputString,
            functionName,
          };
        });
      contractData = {
        ...contractData,
        interactionHistory,
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

      // Wait 100ms for react to render
      // TODO: Remove once this is in a webworker
      await new Promise((resolve) => setTimeout(resolve, 100));

      const interactionCacheHistory: ContractInteractionWithResultHistory =
        interactionHistory.map((interaction, i) => {
          const beforeState = stateHistory[i];
          const afterState = stateHistory[i + 1];
          const result = (() => {
            if (!afterState.cachedValue.validity[interaction.id]) {
              return ContractInteractionResult.Error;
            }
            const same =
              JSON.stringify(beforeState.cachedValue.state) ===
              JSON.stringify(afterState.cachedValue.state);
            if (!same) {
              return ContractInteractionResult.Update;
            } else {
              return ContractInteractionResult.NoUpdate;
            }
          })();

          return {
            ...interaction,
            result,
          };
        });
      contractData = {
        ...contractData,
        interactionCacheHistory,
      };
      controller.enqueue(contractData);

      controller.close();
    },
  });
};
