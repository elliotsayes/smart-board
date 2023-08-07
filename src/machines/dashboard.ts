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
      /** @xstate-layout N4IgpgJg5mDOIC5QQIawBYCMD2KBOEAdAJIB2AlgC7koA2AxANoAMAuoqAA7axXnakOIAB6IALAE5CANgCMAdgAcYgKwqxs2dJXyJAGhABPRACZmKwrOYBmJc0WKV1rRIC+rg6gw58RACJoWLgEhABq5GAA7tx4lIQAypQolGAABOFR9GQpeCgAxtQCqQAqKJgs7Egg3LyFglWiCPLyJoRi0mYmzYrM8mJiBsYIqtKEEg7SztrSzePW7p6BPiEB3sFEGdHYsSSkOfl16RGR9InJaaXlbEI1fAJCjbqt6tLTkiYf9oOI0hqEKrJrCYxNZXvIAX0FiAvEFfIRVrCQpsYnFsmBcgV+KQjpl4mBKKk0RjDn5yAAzMkVG48O71UCNTQqKRiZgSayKPqKV4zWTfBAqOSEZjScaAz7C+TzDzQpbreGyuEBJIkCC0MD0ACqnFQKVSAGEBJRiaklSgqVVbnUHqZhWNJDY5GKJCZrCo+QDFJYnBJtKDFLJVPIoTDlv4FSEAGLkWg5FVq+hRmPokrkAC2aQASihSDBzVwaVaGohNLILLJxiDXaozBy+WzrDJlMwTBIlCphTpg+Gw2s4cU02BaORSGA4+r++mhyPCXt0Qcsak8WrMQI89UC1jrQgzLJCKD2sxmxyVIoJLyjIguWJ-swxF0JOoJOYVCYu72Vt3CBPB8PR8RVeqAAy5CwASRLzkUS5gCupBrpam5Ftu5aWBI4ynkyaizNYfJWEChAmDM2itr8Hwnm+iI9hRhDAaBY70DRYGzsSC5QTBcEbvciEzNeHylhoJgvvYJjnkMqGeu0YjNGosjHqh5GhvK75EAxdHflOaTgTBi6DtBdTsbUCH0j8zR7i+-SshokwmHyjiev6UwOMKDhkVCpDYBAcBCCG6zUgZnFGQgAC0rTyJoZ4CQRkgtCe7qjACIJmMKVhRbI8lymQfB0L5tJbmIig4f0aWKt22WFgFqj4Y5HKSa6zZ9HyJj+oQXIAuo7J3q2rZFR+SlhMcKKlYZIjiM6ljyMKzYSKoQLWReCCglI7YtgK1i2E4rzdZRCnItscRnLqmyDf5w38iyY0TS200fO6MmELoSXCahkrlptilUTtOyaYch0WhxdInae8j-K8HJslyXKzUMHp3U+kxOc4h6pdK3nFb1ppHf9jStm0XRAj0p6yF06h8gtplCa2NjqITKivQiCmmmOGNbgGFh3pKjX2OF4IDHNIzNaC7Y+nekh8bTn6JjkTOIVYzYyE41idayTwiYgzRA861ggh0kpsgGYu9RL6KM79fmY8W5jMHLq2K51wk2dobSspoHSEw4Cj61Ram-lLAVspV+N9JKS31XNatCjJTI+lYVg08jn503KXsjsb+am8zfyNQHNXBzzokOzMigfKhT6rcwSOLGjn4MT7J1OJbJ5KKF-QLVyfLNLuQKchMuiurHFdUQncIqf+ao140Oieg3HIBlr4zSHWIJjJMcySqC8gbe4rhAA */
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

                    "Timeline Interaction Selection": {
                      target: "Idle",
                      internal: true,
                      actions: "jumpListInteraction",
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
