import { assign, createMachine } from "xstate";
import { ContractDataFull, ContractResult } from "../types/contract";
import { Timeline } from "vis-timeline";

type Context = {
  contractData: Partial<ContractDataFull>;
  viewportTab: number;
  viewportInteractionShowDiff: boolean;
  selectedInteractionIndex?: number;
  timeline?: Timeline;
  filter: {
    functions?: Set<string>;
    results?: Set<ContractResult>;
    walletAddresses?: Set<string>;
    timeRange?: {
      start: number;
      end: number;
    };
  };
};

type Event =
  | {
      type: "Update Contract Data";
      data: {
        contractData: Partial<ContractDataFull>;
      };
    }
  | {
      type: "Set Timeline";
      data: {
        timeline: Timeline;
      };
    }
  | {
      type: "State Tab";
    }
  | {
      type: "Interaction Tab";
    }
  | {
      type: "Set Interaction Diff";
      data: {
        viewportInteractionShowDiff: boolean;
      };
    }
  | {
      type: "Timeline Interaction Selection";
      data: {
        selectedInteractionIndex: number;
      };
    }
  | {
      type: "List Interaction Selection";
      data: {
        selectedInteractionIndex: number;
      };
    };

export const dashboardMachine = () =>
  createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QQIawBYCMD2KBOEAdAJIB2AlgC7koA2AxANoAMAuoqAA7axXnakOIAB6IALAE5CANgCMAdgAcYgKwqxs2dJXyJAGhABPRACZmKwrOYBmJc0WKV1rRIC+rg6gw58RACJoWLgEhAGUKCQQtGD0AKqcqJRgAAQAwgKUeCgAxpTJYSgs7Egg3LzUAkKiCLIS1oQqVtIm8ibWEswdYgbGCComspYqEhJW6orSYtYm7p6BPiEB3sFEACrkALZgtOSkMQDKYHnrWzt7RUJlfJUl1bLWioRmEorWzGJTJhoKPYiK8vUHBIVIoBh8VO9rLMQF4gr5QvMVoQAGrkMAAd24eEohH24SSyVRGPoZCSWVy-FIyVWKEwFxKVwqgluiHkw0IzDackUHW0YgGvwQqikI1U8mkr1a8nkYmhsIW-kR8KJmOw2JIpDJOSZhLR6PoeJQBJpdLYlx412ZoGq0qkVlBYnFskUzGdikFkzEDVqbuULtkKjlSsWwaIKqxONJYHJOpVBqOySjMcp+XIADM0-SuBamVVEJpVIQJPJOko5F9tCZBSpJhy2WzlMxzJNFEHlvClnCQidtrswIQABJoambXt7eg9s4pJPalOHaIUgRZ0o5yl5oXWCzyTQBkFibnyQWjEwNdpfNSyR2NWUeGGhhHtkIAGXIsEjURiL7fic10dnAmSecwEXUhl0ZNcWQQDp6jUNonGsaxpBse4j2mItrH5YFnWkCQTDqNsu0VR81lHKdB2HSc+3oL88hnEDAO2YCmTA1cbmtcQrEIKY6lw-c1ClQUrCUDlhiaYENBrKFoVIbAIDgIR5RWc1ygg9iEAAWlkE9gUcR03glXQHirIxEBrb0pmdBRagGEwZlvRT4TIPg6GUy11zEd0TJqD4CIVB9CNc3NIM3DkNFUEwcOcMxmkFExlEIf4rBeV0WmmANfKRTs-PDNVKEC1SRHEYSAQGCQxGYbctKbaxBVsE8IQcVpmGkBDeRvOZiP8vyCnytjCoQV4iyBazL1wmtataQhN2kW1G0UJKpI6wiusyo0ImID9eqtfr7kGF4eRGyQTHGrzhQS-lVA82yXlGDKO3vAAxchaDJLb1y051CBlAMOgGJRxW6LzdHkItajUS6nDMOylu6+9KL2N7IMG95L36SKqpioGJi4mxcJLCYnA8u6Q06+H+w26JEbU3bQtRiK6gx4zeisBQnhGZqQXFRotOJojlpy9VDQJFUqf6tGvrSsqKs0JnTIGL6JG0HQHk5PD2rvTqsqRAXI1-ZMAJFhlWO26oHC9LTlBLRoIukat5d0bQGxa4ZpV5lb4TJ8jYBHU4+1F6ovkGGbHDMJwHFqB5BJSjkOgBYV7AlN2tfhGj-dZdlRgmV5+gBpRBV0PbuLR9p60Dez72T59X3fSmjZUvrTYq0Gs83FpJjzrz-keKZNxscrnWFdx3CAA */
      id: "dashboard",
      predictableActionArguments: true,
      tsTypes: {} as import("./dashboard.typegen").Typegen0,
      schema: {
        context: {} as Context,
        events: {} as Event,
      },
      context: {
        contractData: {},
        viewportTab: 0,
        viewportInteractionShowDiff: false,
        selectedInteractionIndex: undefined,
        filter: {},
      },
      initial: "Initial",
      states: {
        Initial: {
          always: "Dashboard",
        },

        Dashboard: {
          states: {
            Viewport: {
              states: {
                "State View": {
                  entry: "assignViewportTab0",

                  on: {
                    "Interaction Tab": "Interaction View",
                  },
                },

                "Interaction View": {
                  entry: "assignViewportTab1",

                  on: {
                    "State Tab": "State View",

                    "Set Interaction Diff": {
                      target: "Interaction View",
                      internal: true,
                      actions: "assignInteractionDiff",
                    },
                  },
                },
              },

              initial: "State View",
            },

            Data: {
              states: {
                Idle: {
                  on: {
                    "Update Contract Data": {
                      target: "Idle",
                      internal: true,
                      actions: "assignContractData",
                    },
                  },
                },
              },

              initial: "Idle",
            },

            Filter: {},

            Timeline: {
              states: {
                Idle: {},

                "Has Timeline": {
                  on: {
                    "Timeline Interaction Selection": {
                      target: "Has Timeline",
                      internal: true,
                      actions: "assignSelectedInteraction",
                    },

                    "List Interaction Selection": {
                      target: "Has Timeline",
                      internal: true,
                      actions: "setTimelineInteraction",
                    },
                  },
                },
              },

              initial: "Idle",
            },

            List: {
              states: {
                Idle: {
                  on: {
                    "List Interaction Selection": {
                      target: "Idle",
                      internal: true,
                      actions: "assignSelectedInteraction",
                    },
                  },
                },
              },

              initial: "Idle",
            },
          },

          type: "parallel",
        },
      },
    },
    {
      actions: {
        assignContractData: assign({
          contractData: (_, event) => event.data.contractData,
        }),
        assignViewportTab0: assign({
          viewportTab: 0,
        }),
        assignViewportTab1: assign({
          viewportTab: 0,
        }),
        assignInteractionDiff: assign({
          viewportInteractionShowDiff: (_, event) =>
            event.data.viewportInteractionShowDiff,
        }),
        assignSelectedInteraction: assign({
          selectedInteractionIndex: (_, event) =>
            event.data.selectedInteractionIndex,
        }),
        setTimelineInteraction: (context, event) => {
          context.timeline?.setSelection(event.data.selectedInteractionIndex);
        },
      },
    }
  );
