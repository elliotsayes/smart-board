// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "error.platform.contractSelector.Contract Selected.Loading Contract Data:invocation[0]": {
      type: "error.platform.contractSelector.Contract Selected.Loading Contract Data:invocation[0]";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    loadContract: "done.invoke.contractSelector.Contract Selected.Loading Contract Data:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    assignErrorInfo: "error.platform.contractSelector.Contract Selected.Loading Contract Data:invocation[0]";
    assignFirstContract: "Select First Contract";
    assignInitialToSelected: "";
    assignPartialContractData: "Data Available";
    assignReplacementContract: "Replace Contract";
    clearContractData: "Replace Contract";
    updateQueryString: "Replace Contract" | "Select First Contract";
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
    | "Contract Selected.Contract Load Complete"
    | "Contract Selected.Contract Load Failure"
    | "Contract Selected.Initial"
    | "Contract Selected.Loading Contract Data"
    | "Contract Selected.Loading Contract Data.Processing"
    | "Idle"
    | "Initial"
    | {
        "Contract Selected"?:
          | "Contract Load Complete"
          | "Contract Load Failure"
          | "Initial"
          | "Loading Contract Data"
          | { "Loading Contract Data"?: "Processing" };
      };
  tags: never;
}
