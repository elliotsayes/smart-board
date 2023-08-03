import { createMachine } from "xstate";
import { ContractDataFull } from "../types/contract";

type Context = {
  contractData: Partial<ContractDataFull>;
  viewportTab: number;
  selectedInteractionIndex?: number;
};

type Event = {
  type: "Update Contract Data";
  data: {
    contractData: Partial<ContractDataFull>;
  };
};

export const dashboardMachine = () =>
  createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QQIawBYCMD2KBOEAdAJIB2AlgC7koA2AxANoAMAuoqAA7axXnakOIAB6IALAE5CANgCMAdgAcYgKwqxs2dJXyJAGhABPRACZmKwrOYBmJc0WKV1rRIC+rg6gw58RACJoWLgEhAGUKCQQtGD0AKqcqJRgAAQAwgKUeCgAxpTJYSgs7Egg3LzUAkKiCCaK0oTWYnVqttJ1NgbGCCqyioS1SkoS0syy1g7uHiCk2BBwQl5BvkJlfJUl1QC00lJNmmYm8irSSp2Ix4Q9YtYmYswaEvYmsu6egT4hZHx0KzxrghtxIozghZGIxK8QIsPv53sEIL9yvwAaAts9CHtZAcjiddBIVCDatZCBIJFj5DdHMwTpDofDQnDfKFyLBOLQUF0uH8KiiRKZ6j0HLp5LcbmZzCDbMwMYp7PJmCYrnVbrTGSEAt56QVEf8qogFPVFCYdmIKSpjfiCUZEFKZXKFUrpCZVZqmRqluqUOFItEdTy9TVboQjSazRa1CDVPUJPKxCYbo0mk1Jq4gA */
    id: "dashboard",
    predictableActionArguments: true,
    tsTypes: {} as import("./dashboard.typegen").Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Event,
    },
    context: {
      viewportTab: 0,
      contractData: {},
    },
    initial: "Initial",
    states: {
      Initial: {
        always: "Dashboard",
      },

      Dashboard: {
        states: {
          Display: {},
          Data: {
            states: {
              Idle: {
                on: {
                  "Update Contract Data": {
                    target: "Idle",
                    internal: true,
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
  });
