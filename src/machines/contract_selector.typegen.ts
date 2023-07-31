// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    loadContract: "done.invoke.contractSelector.Contract Selected.Loading Contract Data:invocation[0]";
  };
  missingImplementations: {
    actions: "assignPartialContractData";
    delays: never;
    guards: "hasInitialContractId" | "isContractReplacable";
    services: "loadContract";
  };
  eventsCausingActions: {
    assignFirstContract: "Select First Contract";
    assignInitialToSelected: "";
    assignPartialContractData: "Data Available";
    assignReplacementContract: "Replace Contract";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    hasInitialContractId: "";
    isContractReplacable: "Replace Contract";
  };
  eventsCausingServices: {
    loadContract: "";
  };
  matchesStates:
    | "Contract Selected"
    | "Contract Selected.Contract Data Loaded"
    | "Contract Selected.Contract Load Failure"
    | "Contract Selected.Initial"
    | "Contract Selected.Loading Contract Data"
    | "Contract Selected.Loading Contract Data.Processing"
    | "Idle"
    | "Initial"
    | {
        "Contract Selected"?:
          | "Contract Data Loaded"
          | "Contract Load Failure"
          | "Initial"
          | "Loading Contract Data"
          | { "Loading Contract Data"?: "Processing" };
      };
  tags: never;
}
