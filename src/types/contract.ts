import {
  ContractDefinition,
  EvalStateResult,
  GQLNodeInterface,
  SortKeyCacheResult,
} from "warp-contracts";

export type ContractMeta = Pick<
  ContractDefinition<unknown>,
  "owner" | "txId" | "srcTxId" | "contractType" | "src"
> & {
  timestamp: number;
};

export type ContractState = SortKeyCacheResult<EvalStateResult<unknown>>;

export type ContractStateHistory = ContractState[];

export type ContractInteraction = GQLNodeInterface;

export type ContractInteractionHistory = ContractInteraction[];

export enum ContractInteractionResult {
  Update = "has change",
  NoUpdate = "no change",
  Error = "error",
}

export type ContractInteractionCache = ContractInteraction & {
  functionName?: string;
  result: ContractInteractionResult;
};

export type ContractInteractionCacheHistory = ContractInteractionCache[];

export type ContractDataFull = {
  meta: ContractMeta;
  initialState: ContractState;
  latestState: ContractState;
  interactionHistory: ContractInteractionHistory;
  stateHistory: ContractStateHistory;
  interactionCacheHistory: ContractInteractionCacheHistory;
};
