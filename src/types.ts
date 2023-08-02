import {
  ContractDefinition,
  EvalStateResult,
  GQLNodeInterface,
  SortKeyCacheResult,
} from "warp-contracts";

export type ContractMeta = Pick<
  ContractDefinition<unknown>,
  "owner" | "txId" | "srcTxId" | "contractType" | "src"
>;

export type ContractState = SortKeyCacheResult<EvalStateResult<unknown>>;

export type ContractStateHistory = ContractState[];

export type ContractInteraction = GQLNodeInterface;

export type ContractInteractionHistory = ContractInteraction[];

export type ContractDataFull = {
  meta: ContractMeta;
  initialState: ContractState;
  latestState: ContractState;
  interactionHistory: ContractInteractionHistory;
  stateHistory: ContractStateHistory;
};
