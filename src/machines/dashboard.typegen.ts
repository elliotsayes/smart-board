// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: "jumpListInteraction" | "selectTimelineInteraction";
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    assignContractData: "Update Contract Data";
    assignFilterUpdate: "Filter Time Range";
    assignInteractionDiff: "Set Interaction Diff";
    assignSelectedInteraction:
      | "List Interaction Selection"
      | "Timeline Interaction Selection";
    assignViewportTab0: "" | "State Tab";
    assignViewportTab1: "Interaction Tab" | "Set Interaction Diff";
    jumpListInteraction: "Timeline Interaction Selection";
    selectTimelineInteraction: "List Interaction Selection";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {};
  matchesStates:
    | "Dashboard"
    | "Dashboard.Data"
    | "Dashboard.Data.Idle"
    | "Dashboard.Filter"
    | "Dashboard.Filter.Idle"
    | "Dashboard.List"
    | "Dashboard.List.Idle"
    | "Dashboard.Timeline"
    | "Dashboard.Timeline.Idle"
    | "Dashboard.Viewport"
    | "Dashboard.Viewport.Interaction View"
    | "Dashboard.Viewport.State View"
    | "Initial"
    | {
        Dashboard?:
          | "Data"
          | "Filter"
          | "List"
          | "Timeline"
          | "Viewport"
          | {
              Data?: "Idle";
              Filter?: "Idle";
              List?: "Idle";
              Timeline?: "Idle";
              Viewport?: "Interaction View" | "State View";
            };
      };
  tags: never;
}
