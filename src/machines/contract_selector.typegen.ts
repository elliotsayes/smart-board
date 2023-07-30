// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    spawnContractMachine: "done.invoke.contractSelector.Contract Selected.Spawning Contract Machine:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: "hasInitialContractId";
    services: "spawnContractMachine";
  };
  eventsCausingActions: {
    assignFirstContract: "Select First Contract";
    assignInitialToSelected: "";
    assignReplacementContract: "Replace Contract";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    hasInitialContractId: "";
  };
  eventsCausingServices: {
    spawnContractMachine: "";
  };
  matchesStates:
    | "Contract Selected"
    | "Contract Selected.Idle"
    | "Contract Selected.Initial"
    | "Contract Selected.Spawning Contract Machine"
    | "Idle"
    | "Initial"
    | {
        "Contract Selected"?: "Idle" | "Initial" | "Spawning Contract Machine";
      };
  tags: never;
}
