// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    assignContractData: "Update Contract Data";
    assignInteractionDiff: "Set Interaction Diff";
    assignSelectedInteraction:
      | "List Interaction Selection"
      | "Timeline Interaction Selection";
    assignTimeline: "Set Timeline";
    assignViewportTab0: "" | "State Tab";
    assignViewportTab1: "Interaction Tab" | "Set Interaction Diff";
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
    | "Dashboard.List"
    | "Dashboard.List.Idle"
    | "Dashboard.Timeline"
    | "Dashboard.Timeline.Has Timeline"
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
              List?: "Idle";
              Timeline?: "Has Timeline" | "Idle";
              Viewport?: "Interaction View" | "State View";
            };
      };
  tags: never;
}
