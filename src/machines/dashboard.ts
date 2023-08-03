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
      /** @xstate-layout N4IgpgJg5mDOIC5QQIawBYCMD2KBOEAdAJIB2AlgC7koA2AxANoAMAuoqAA7axXnakOIAB6IALAE5CANgCMAdgAcYgKwqxs2dJXyJAGhABPRACZmKwrOYBmJc0WKV1rRIC+rg6gw58RACJoWLgEhABq5GAA7tx4lIQAypQolGAABOFR9GQpeCgAxtQCqQAqKJgs7Egg3LyFglWiCPIqUswm1nKKEszaYiayBsYIqlISEqry0oq2JvLyYu6egT4hAd7BRBnR2LEkpDn5dekRkfSJyWml5WxCNXwCQo1zUlaKJmKTsorMX4qDiNIxGJCCpZBJfspvrIVIsQF4gr5CGsESEtjE4tkwLkCvxSMdMvEwJRUpjsUc-OQAGaUiq3Hj3eqgRqaVSECTyZjsxRyd7aEz-BAqQGEZjNZrKZjmQGKWHwlb+ZYbJHJFAkCC0MD0ACqnFQKVSAGEBJQyakAklaVU7nVHogwdYQVZpLN2t1umIBSp+pYWuDzGJuWJrCZZYrEcj5YRiuQALZgWjkUhgQgACTQJVj8cTmujcYTSZJ+yxh1xqUJGpxAktXHpNoa4nabJMZhs1m5b201gF3VkMms6lFkxs0IWHjhYdWE6IuazSdT6Zn+c1ABlyLBiaSS0Vy2BK6Rq9Va7jbQhrBJFDIVG0xJKev1mx6jHaevIfV7pOCxvIzKOlutw1OhCruuaoavQwEbkWZKljue4Htax71gg3QOmo7RONYHTDl2T7IcGbLWH0EigtyEgmBI1ihv+k7UdOmZLmcRIZnm2bwUeDxIWCvb9Josg3r88x-LhDjMIQkyKNCfE9OCfHuGOpDYBAcBCHKGx0rUiFMogAC07xiR8H7stIzpntynrSI6QbvA4mEoVoVEokQZB8HQ6kMieAYCnxv7jrRyq0W5dZaQgjYmF61iSu0tjSD8j5DCYyiEIo8iaMwqhdJM7I+apAF+WiOyUIFmkiOIShicGYI3ilsgtjhQwzCC9g9t+PTSHMDmRhGSr5bs5z6lsRUccF77lf04yipo-K4V6va6NoOhtm05HZYBXWIj1GJQVueIDVa7GMiVCAOMCNXKByoImMZnrenNOgqNy-bsvIHVKmtk5JINB2NNMbIOJ+-SSGF0gCg1-ZtboHLSLY4wvbljnKkkoFgJ9J6yM4v1dGCANkUKAojElfSqAGzbnuCsM0fDABi5C0DkKOcbMFizG0HLjFDUx1Yg3wWc0UzfkC0xkbI5MKn5i7ZvTwUpYQYXtJFmFDnxAq6A6CXvJILQ-JjIv+fD4tzsQ6rI3tGlDYdmhSLLEVtArMVK7hVg9IQZ5eglNVmM0IZjjlFORvryZprAzGzsbNam19pjkUlXQdN8ujpfoDuSr2XxTBIHOAsGOtvUQEGS4dzSjKn0xepMHxCUMuiieMdjQo4NUdNngEQUj+ffaKbLF-2syAkoArJReQb9jY-HKC0cmuEAA */
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
                      actions: "selectTimelineInteraction",
                    },
                  },
                },
              },

              initial: "Idle",

              on: {
                "Set Timeline": {
                  target: ".Has Timeline",
                  actions: "assignTimeline",
                },
              },
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
        assignTimeline: assign({
          timeline: (_, event) => event.data.timeline,
        }),
        selectTimelineInteraction: (context, event) => {
          context.timeline?.setSelection(event.data.selectedInteractionIndex);
        },
      },
    }
  );
