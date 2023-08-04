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
      /** @xstate-layout N4IgpgJg5mDOIC5QQIawBYCMD2KBOEAdAJIB2AlgC7koA2AxANoAMAuoqAA7axXnakOIAB6IALAE5CANgCMAdgAcYgKwqxs2dJXyJAGhABPRACZmKwrOYBmJc0WKV1rRIC+rg6gw58RACJoWLgEhABq5GAA7tx4lIQAypQolGAABOFR9GQpeCgAxtQCqQAqKJgs7Egg3LyFglWiCPLyJoRi0mYmzYrM8mJiBsYIqtKEEg7SztrSzePW7p6BPiEB3sFEGdHYsSSkOfl16RGR9InJaaXlbEI1fAJCjbqt6tLTkiYf9oOI0hqEKrJrCYxNZXvIAX0FiAvEFfIRVrCQpsYnFsmBcgV+KQjpl4mBKKk0RjDn5yAAzMkVG48O71UCNTQqKRiZgSayKPqKV4zWTfBAqOSEZjScaAz7C+TzDzQpbreGyuEBJIkCC0MD0ACqnFQKVSAGEBJRiaklSgqVVbnUHqZhWNJDY5GKJCZrCo+QDFJYnBJtKDFLJVPIoTDlv4FSEAGLkWg5FVq+hRmPokrkAC2aQASihSDBzVwaVaGohNLIpBJxhKxCY1OW+WyLKy5MD5DYW+Dg+Gw2s4cU02BaORSGA4+re+mB0PCXt0Qcsak8WrMQI89UC1jrQgzLJCKDVM7tFZrBIBkZEI5PapNE3m+CVB3uytO4Qx-3B8PiKr1QAZciwAlE2cigXMAl1IFdLXXItN2YVoRg6CQrCsZheVPBArBdQhuneFl5FkRRrDEe9ES7YjCB-P8R3ocj-2nYk52A0DwLXe4oJFUYuXZMRJQkZpwRPIYEKkI92RglQuSQqVpVIbAIDgIQQ3Walakg+lEAAWlaXDS1kasTF+Hjq0Ud1RgBEFJFBNktG0O9pQUuEyD4OglNpDcxCM1CA0I2ynwRUNnMLVThgsEwHHsPpJRUGC+j5ELty5UyJAFLRFC6aQiNDeUHw2Y4UX8lSRHEZ1LBbaQYOPJwPj5Cz-jKgUekmPSunSuVfLlZFtjiM5dU2PKWMC9RmGK4UytUIETHdPDMIkYUdNLHjnDcbyssy0j2p2ADQJxSJerpAqEEUHj-leDk2S5LlxtQj0puFaxhXwpDZGaxUfOSFAdo3Q6q0lEL7AQrp1CqkUd0ilL+lm3cnsfZbTRHd6oIDCwvqBHoDp0vi+RGQh8O0Rsq0kWR1EhkiMsTHI4cCpD5DaJwbAUaa8OBPlZh3V0nA6f1hXGImVpJ6NYw-NVyb2qw1Gp27nF0ZDQb5Ll2JMWbNGcFQXRsxZoafF8JzAIXGjZQgQpR8LXSi-jEGaQafXUDi+iBUtudans+y12GLWY3aGT+A2wq442ulNhBLZkJQPnLabrFux6ltIh2QmonXEDUax9Yj5oxLZQSmeaNpenDplIoFAj7afaiXfzZS+r20rtxdZDU4Oo9Sxl34sbZZD7DbhR3HcIA */
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
