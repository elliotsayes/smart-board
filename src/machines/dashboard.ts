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
      /** @xstate-layout N4IgpgJg5mDOIC5QQIawBYCMD2KBOEAdAJIB2AlgC7koA2AxANoAMAuoqAA7axXnakOIAB6IALAE5CANgCMAdgAcYgKwqxs2dJXyJAGhABPRACZmKwrOYBmJc0WKV1rRIC+rg6gw58RACJoWLgEhABq5GAA7tx4lIQAypQolGAABOFR9GQpeCgAxtQCqQAqKJgs7Egg3LyFglWiCPLyJoRi0mYmzYrM8mJiBsYIqtKEEg7SztrSzePW7p6BPiEB3sFEGdHYsSSkOfl16RGR9InJaaXlbEI1fAJCjbqt6tLTkiYf9oOI0hqEKrJrCYxNZXvIAX0FiAvEFfIRVrCQpsYnFsmBcgV+KQjpl4mBKKk0RjDn5yAAzMkVG48O71UCNTQqKRiZgSayKPqKV4zWTfBAqOSEZjScaAz7C+TzDzQpbreGyuEBJIkCC0MD0ACqnFQKVSAGEBJRiaklSgqVVbnUHqZhWNJDY5GKJCZrCo+QDFJYnBJtKDFLJVPIoTDlv4FSEAGLkWg5FVq+hRmPokrkAC2aQASihSDBzVwaVaGohNLILLJxiDXaozBy+WzrDJlMwTBIlCphTpg+Gw2s4cU02BaORSGA4+r++mhyPCXt0Qcsak8WrMQI89UC1jrQgzLJCKDVM7tFZrBIBkZEI5PapNHIPmJmmou72Vt3CBPB8PR8RVeqADLkWACSJeciiXMAV1INdLU3Itt3LSwJHGRQJCZNRZmsPlj1aEwZm0Vtfg+FRFCfREe1Iwh-0Asd6EooDZ2JBcwIgqCN3uWDpB6IUK1kBwJGYDQULrHDCF0EVrHvHQWkkdxpVIbAIDgIQQ3Walahg+lEAAWlaeRNAkWQTBUHDJBaIj3VGAFKzkVsPl+NxpWUuEyD4OhVNpLcxEUTD+hI0N5WfCA3MLDThgsEwHHsPpJXbLozyGcLdy5D0zFBU9VF8uUET85FtkoIL1JEcRnUseRhWbU8nA+PlUv+cr7A4jkRW0DLFVfHKdjOXVNnytiQvUZgSrKltVCBEx3R4kS+NvctW2cezFgC-zyPa1F6JA7FuotVi6UKhBkPkf5Xg5NkuS5Mbz35CbdGFaxhUUZxmGYWQWpfRbTR6nbGlbNouiBHpkIM8E4sQGrXXsVR7tbHiXrIvzTTHD6twDCwxF+8L7H0rp1D5EZCHu7RWQIyRSzEGGlr8xMckR2CrGbGQnBPa7W2dXkLuaA7nXEoyNCe+xnoc18srlSn0QRra1N63arHbenrEZvjmZMVmhiStpWRvJXwv9IMBbe193ynMBqZCtlCC1yL7zB2K+WaAafTUSK2TZXoyaFvsB0NsX8wlz7iz+c2OUtmK+jrbQZCUD5EL4uWntd19aON3anFGdp73tRQUukG3lDxqxUce-jJgDOPFtor31x9rciLENpfj6PiM4dPkOWwn0AxbFpfi0GTXCAA */
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
