import { assign, createMachine } from "xstate";
import { ContractDataFull, ContractResult } from "../types/contract";

type Context = {
  contractData: Partial<ContractDataFull>;
  viewportTab: number;
  viewportInteractionShowDiff: boolean;
  selectedInteractionIndex?: number;
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
        selectedInteractionIndex?: number;
      };
    }
  | {
      type: "List Interaction Selection";
      data: {
        selectedInteractionIndex: number;
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
      /** @xstate-layout N4IgpgJg5mDOIC5QQIawBYCMD2KBOEAdAJIB2AlgC7koA2AxANoAMAuoqAA7axXnakOIAB6IALAE5CANgCMAdgAcYgKwqxs2dJXyJAGhABPRACZmKwrOYBmJc0WKV1rRIC+rg6gw58RACJoWLgEhABq5GAA7tx4lIQAypQolGAABOFR9GQpeCgAxtQCqQAqKJgs7Egg3LyFglWiCPLyJoRi0mYmzYrM8mJiBsYIqtKEEg7SztrSzePW7p6BPiEB3sFEGdHYsSSkOfl16RGR9InJaaXlbEI1fAJCjbqt6tLTkiYf9oOI0hqEKrJrCYxNZXvIAX0FiAvEFfIRVrCQpsYnFsmBcgV+KQjpl4mBKKk0RjDn5yAAzMkVG48O71UCNTQqKRiZgSayKPqKV4zWTfBAqOSEZjScaAz7C+TzDzQpbreGyuEBJIkCC0MD0ACqnFQKVSAGEBJRiaklSgqVVbnUHqZhWNJDY5GKJCZrCo+QDFJYnBJtKDFLJVPIoTDlv4FSEAGLkWg5FVq+hRmPokrkAC2aQASihSDBzVwaVaGohNLILLJxiDXaozBy+WzrDJlMwTBIlCphTpg+Gw2s4cU02BaORSGA4+r++mhyPCXt0Qcsak8WrMQI89UC1jrQgzLJCKDVM7tFZrBIBkZEI5PapNHIPmJmmou72Vt3CBPB8PR8RVeqADLkWACSJeciiXMAV1INdLU3Itt2bNoBQ6CQrCsZheXPBArBdQhuneFl5FkRRrDEJ9ER7MjCH-QCx3oKigNnYkFzAiCoI3e5YJFUYuXZe8T2acEzyGZCpBPdlmxULlUKlaVSGwCA4CEEN1mpWoYPpRAAFpWgI8tZBMFQTF+Vt9MUd1RgBEEtAMwjHDcaUlLhMg+DoFTaS3MRTIwgMSPs18EVDVzC3U4YLBMBx7D6SV2y6QTTH9QguQBMwDJBcZpFI0N5WfDZjhRQK1JEcRnUseRhWbU8nA+PlQSkaLxgBUsrGkDkMrlfy5WRbY4jOXVNny9jgvUZgSrKltVCBEx3UInCJGFPTy1bZw7MWbKsoozqdmAiCcUifq6UKhBFFbf5Xg5NkuS5SaMI9GbhWsYUiNQ2RWsVPzkhQPat2OsQuiBHojr0gTqpFPd239MHiNUXoXpfVbTTHT7YIDCwfslML7GQrp1D5EYEtBdsfR+yRSx8laKPauFExyRHgtQ1pfT42bW2ddChn4sYXXaH0CJrdLfLh18qfRBGLTY-aGXMYaGeZ1knlZi9tDaVkbxMPSHAUGHyMy98pzAGmDrZQgwv+yLXWbPo+WaYafTUANmucZs+bJzKKZCHXPxF-NVIGg6A13Y2It46KLYwm2ZCUD4JCjmx7ue-nydfOj9caNQGxdNCHyOk9y0t5olZaZq7yZIN45dxOANRH9k5+NCjdjzO2WEvkuTEBK2TQ+wO419xXCAA */
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
                      actions: "assignSelectedInteraction",
                    },

                    "List Interaction Selection": {
                      target: "Idle",
                      internal: true,
                      actions: "selectTimelineInteraction",
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
