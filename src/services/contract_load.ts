import { DefaultEvaluationOptions, Warp } from "warp-contracts";
import * as Diff from "diff";
import { ContractDataFull, ContractResult } from "../types/contract";

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
        // ...contractData,
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

      const interactionCacheHistory = sortedInteractions.map(
        (interaction, i) => {
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

          const beforeState = stateHistory[i];
          const afterState = stateHistory[i + 1];
          const result = (() => {
            if (!afterState.cachedValue.validity[interaction.id]) {
              return ContractResult.Error;
            }
            const diff = Diff.diffJson(
              beforeState.cachedValue.state as object,
              afterState.cachedValue.state as object
            );
            if (diff.filter((d) => d.added || d.removed).length > 0) {
              return ContractResult.Update;
            } else {
              return ContractResult.NoUpdate;
            }
          })();

          return {
            functionName,
            result,
          };
        }
      );
      contractData = {
        ...contractData,
        interactionCacheHistory,
      };
      controller.enqueue(contractData);

      controller.close();
    },
  });
};
