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
    };

export const dashboardMachine = () =>
  createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QQIawBYCMD2KBOEAdAJIB2AlgC7koA2AxANoAMAuoqAA7axXnakOIAB6IALAE5CANgCMAdgAcYgKwqxs2dJXyJAGhABPRACZmKwrOYBmJc0WKV1rRIC+rg6gw58RACJoWLgEhABq5GAA7tx4lIQAypQolGAABOFR9GQpeCgAxtQCqQAqKJgs7Egg3LyFglWiCPLyJoRi0mYmzYrM8mJiBsYIqtKEEg7SztrSzePW7p6BPiEB3sFEGdHYsSSkOfl16RGR9InJaaXlbEI1fAJCjbqt6tLTkiYf9oOI0hqEKrJrCYxNZXvIAX0FiAvEFfIRVrCQpsYnFsmBcgV+KQjpl4mBKKk0RjDn5yAAzMkVG48O71UCNTQqKRiZgSayKPqKV4zWTfBAqOSEZjScaAz7C+TzDzQpbreGyuEBJIkCC0MD0ACqnFQKVSAGEBJRiaklSgqVVbnUHqZhWNJDY5GKJCZrCo+QDFJYnBJtKDFLJVPIoTDlv4FSFiuQALZgWjkUhgFVq+iRmNxhOEvbog5Y1J4tWYgTmrg0q0NUyqf5WfoONlieTMExuoyILnyIW9FQmKyNnvSYPhsNrOGp2PxxPEVXqgAy5FgBKJOaK+bAhdIxeqpax1oQwNG0kbYkc1hBINkjj5ViBhGsJ8c3eUKnsKgHw5Wg8Is-nSZnc4XWeJXMVzXDdLW3csEAkLQxgkXoOm7RtbxMPlnSkZ1FFdZgsN+KZ3GlUhsAgOAhBDdZqVqcD6UQZh3VGAEQRMaRFEYpsQSlRY3yIMg+DocjaR3I9L36V9ESHUS+LLKjhmZLogR6RQoK6dQ+RMf1CC5ejQQ6MQzBfaVSMVD9kW2SgJMokRxGdSwGwPEwJFUIFkJbBBQSkJ87PZRxmFUYT9I-BFQzCY4UQSJJdU2Mz7gg9RmGs4VG3spwPndc9CF0YVZG7CQJElWQ3D8zj5UK4ydkXNccUiSK6QshAFPbAUmN0dkmI6FLPXSyZhQwntZBEwKArlU0qp3HK2lk1T7EU8EBmc1ybyff0mNBLQ5HYmVCoGwzlUnNVhoggMLB0yUJoUzLpr5EZ1NBJ8fR0yRZHUPrBo-AAxchaByPapMyhw0vsGZxl0htrD5HprDSm6ukYpR7LEJ7DMK0d0zAL6asBds2Ps2wHrZUE+Vmf4H3rZiMPUfKONEorKaR8cf1RhlHDaW8sfkHHb2kFC+kIF1VDqmZtC7eH30Kr9TItLcoqk5pwddBtnRZc9JHkfGOTtPKT2Z+sgwKynNpCUW6fFijJZq5jZHmuXgWYRWctB8ExvBFRmO7O84bwoA */
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
      initial: "Dashboard",
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
      },
    }
  );
