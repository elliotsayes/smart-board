import { assign, createMachine } from "xstate";
import { ContractDataFull, ContractInteractionResult } from "../types/contract";

type Context = {
  contractData: Partial<ContractDataFull>;
  viewportTab: number;
  viewportInteractionShowDiff: boolean;
  selectedInteractionIndex?: number;
  filter: {
    functions?: Set<string>;
    results?: Set<ContractInteractionResult>;
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
      type: "Interaction View Interaction Selection";
      data: {
        selectedInteractionIndex: number;
      };
    }
  | {
      type: "List Interaction Selection";
      data: {
        selectedInteractionIndex: number;
      };
    }
  | {
      type: "Timeline Interaction Selection";
      data: {
        selectedInteractionIndex?: number;
      };
    }
  | {
      type: "Filter Time Range";
      data: {
        timeRange: {
          start: number;
          end: number;
        };
      };
    };

export const dashboardMachine = () =>
  createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QQIawBYCMD2KBOEAdAJIB2AlgC7koA2AxANoAMAuoqAA7axXnakOIAB6IALAE5CANgCMAdgAcYgKwqxs2dJXyJAGhABPRACZmKwrOYBmJc0WKV1rRIC+rg6gw58RACJoWLgEhABq5GAA7tx4lIQAypQolGAABOFR9GQpeCgAxtQCqQAqKJgs7Egg3LyFglWiCPLyJoRi0mYmzYrM8mJiBsYIqtKEEg7SztrSzePW7p6BPiEB3sFEGdHYsSSkOfl16RGR9InJaaXlbEI1fAJCjbqt6tLTkiYf9oOI0hqEKrJrCYxNZXvIAX0FiAvEFfIRVrCQpsYnFsmBcgV+KQjpl4mBKKk0RjDn5yAAzMkVG48O71UCNTQAwhdCSg6TMWQmWxab7DaxiQg2cySTkA6wSZpQmHLfxLdbw5IoEgQWhgegAVU4qBSqQAwgJKMTUgEklSqrc6g9TMxRhJJDY5ICTBIuSpeQDFJYnBJtKDFLJVPIpXK4QiZYQAGLkWg5ZWq+hRmPokrkAC2aQASihSDAzVwaZaGohNNZrIRSyoHBLARIJfojIhxlJFB95KWHCpXr9g2tQyGQsU02BaORSGA42rB+mR2PCXt0Qcsak8arMQI89UC1irQgPrJLFZpr9flZ2ryJcx-sCTACbcCemIe4jZb2QgAZciwVEqtUfr9z-Y12xFcwCAjcLW3IsmmYAVrBbSYAxUZhnVrc9pCkDpFDZcwSw0J9wzDeVkW2VF52JJdNiyMjFyKTYAIXIDl2HUC6nArd7igqw7X+ZCxGUSR4JMXk5FabQW2BTQTHQ9p3A8EBSGwCA4CEaV1mpWpIPpRAAFopC5WtNGUeRpB6cV3VGAEQS5SR1CQhx8PlMg+DodTaR3PjeQDR85NUvtXwgVzCy0hA4MIYzmHsf0VC5WQfVkXkbykcwJFkBxxW9VlpAcvznzCY4UUCzSRHEF1LHkG1kLtJwPl5fkLP6RQTPCqSJHUbKVn7DZ8pIhIkh1TZCo44L1EvBQKudVQgSEhsEA9MKJBtTlYolZw3B8zqFX8vKohRXZAMOAbzXYulioQRQJX+V5FF0OCTI6d1Uvmm1rBtLCrA5dqX1yk0UEGk7GgusQuiBHpzs5cEBhm0EpGsOzYtS8rdG0T7Nu+xUJz+ndELaYGTFBlKunUXkRkILDtGYH0gZFNr1q2wi4UTHJMc45DL10ewRqUStAV5LCBTvWQVB9PGWzbFH6ZCRn0Qxo6NKG07D09dnHDEXpHH9axzxMfd1CUMxnH5FtvMWOmNqnYdRzAZngsasL2UiwWYri3mpLC9oIocc6+ay2m0a282Z3HYgf2thX+Ttj2oqd6RzwDZkpnOm8xHK5PxY2v9KFDxpOzZvi4pPFLfhd+QZA0c7xQ5VKKbTraM5l-M5f+n57Dd865ALrRIaGFKLHBnQgdeHDZNcIA */
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

                    "Interaction View Interaction Selection": {
                      target: "Interaction View",
                      internal: true,
                      actions: [
                        "assignSelectedInteraction",
                        "jumpListInteraction",
                        "selectTimelineInteraction",
                      ],
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

            Filter: {
              states: {
                Idle: {
                  on: {
                    "Filter Time Range": {
                      target: "Idle",
                      internal: true,
                      actions: "assignFilterUpdate",
                    },
                  },
                },
              },

              initial: "Idle",
            },

            Timeline: {
              states: {
                Idle: {
                  on: {
                    "Timeline Interaction Selection": {
                      target: "Idle",
                      internal: true,
                      actions: [
                        "assignSelectedInteraction",
                        "jumpListInteraction",
                      ],
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
                      actions: [
                        "assignSelectedInteraction",
                        "selectTimelineInteraction",
                      ],
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
          viewportTab: 1,
        }),
        assignInteractionDiff: assign({
          viewportInteractionShowDiff: (_, event) =>
            event.data.viewportInteractionShowDiff,
        }),
        assignSelectedInteraction: assign({
          selectedInteractionIndex: (_, event) =>
            event.data.selectedInteractionIndex,
        }),
        assignFilterUpdate: assign({
          filter: (context, event) => ({
            ...context.filter,
            ...event.data,
          }),
        }),
      },
    }
  );
