import { createMachine, assign } from "xstate";
import { ContractDataFull } from "../types/contract";
import { WarpFactory } from "warp-contracts";
import { loadContractData } from "../services/contract_load";

type Context = {
  initialContractId?: string;
  selectedContractId?: string;
  contractData: Partial<ContractDataFull>;
  error?: object;
};

type Events =
  | {
      type: "Replace Contract";
      data: {
        replacementContractId: string;
      };
    }
  | {
      type: "Select First Contract";
      data: {
        firstContractId: string;
      };
    }
  | {
      type: "Data Available";
      data: Partial<ContractDataFull>;
    }
  | {
      type: "Data Loaded";
    };

export const contractManagerMachine = (initialContractId?: string) =>
  createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QGMD2A7ALgJwIbMwGUwAbMA1bAOgEl0BLTe3EgYgG0AGAXUVAAdUsRvQx8QAD0QBaACwA2KvIDs82bIBMADjXLlnDQFYANCACeMjQE4qVgMwBGeRpedDnBw9V2Avj9NoWHgExGQU1HQiLBwOvEgggsJMYvFSCM5Usg5ahlYOdoYOHoZZphYITlpUWkZ68loeGgVWGn4BGDj4RKTkmJRUAMIdwZgABKG9kKwASmD8JPhgo0NBXVxxAkIiKaBpLTYOhlpWytaOhu7yZTJaslSGdXqetzryhm0ggZ0hPeGDw11xr9MJBaAwmNF1uJEtt0OI0soSrY7PV7EYHLIrLlrghMbZ8pwVKcjI4ch8viMJn8Vt8xlSQRAqAAZVC4CD0dBQZYAgijAAiuEwuFYEAwYCoHIAbqgANbiilden9GkjIFhBnM1nsznc1a8gVChBS1DIQWidDrKHxGHJOGpRCnByZVwtbRaRx2WQ42SGDRUZR2V6cOzFU7vfyfHnddXKqNqyaMllsjlclWAg3CsDYbD9eaCgBmlAAtlQFT8Y9Q07z6aCk9rU3GM0b0NLTbbLTxoVtbfDEJ4ipk7Fj3VkQworuZEApOJktI6vCTZB5yVGlZW4zXE1qU7rafzBcKM6M65ArZskubewh7IZqlYsQ4NJxCbI7BplN7ClQmg1g8H7yGvgRmW0a9LGep0sCtbbjqVZjBmVAAAo5sgcDCJyrBHgAgpKuD0AsABGZBngk3aXvaCBaMcVAFIGnDKCctwqHYOLopkz7ZHO7gnA4LQrhBa60BAZCsPSowAGL0NgsBjHBJE2uRuyIHYjhKIS7gBk8Lg+qxPq2PIGJUfI9EolYfgRugqAQHA4ggWuXYXjskgyFYdwqGomg6LIegGCYk4INIRg2CUVjBr6aiBu6-G0oJkQQiQDmwle1HuA0BROPUS5uDi0j2NUGjOE+aX5D6WjRZSwLgXum6JT2FHyCi9zGbktQNEYfnlNIC5UISKmGAZeSvoi5WKpV64QfGBCgnFzAJdaZFOQihh2DRvGcOOWLvmoOUYj1GjecZQ1zk0ygjeWYHjdVUFbsmsGNgetWKc56S3E1bgtA8bUXDiniKK6KkGUUyhFLIZ2gdSG7XZqt0NhNCHISaaEpo9i0Om+b0tZ9vkdYg1g2Pomh2MonlE0YYOCXBk0apTdbckW8xgCCKN2kp6QnPp2QeJinCuW+OK+k6BVZK+bhZEc5Njf8E2blLe60+JeEkAArtgYDM1eRTs-kLgMU0uQGBo-OnPcVg1Bohx5AZQHtAJks0MJavzY5LPPV1+NDs4RTuCiwb5LpigC4GJSe+oxPmT4QA */
      id: "contractSelector",

      predictableActionArguments: true,
      tsTypes: {} as import("./contract_manager.typegen").Typegen0,

      schema: {
        context: {} as Context,
        events: {} as Events,
      },

      context: {
        initialContractId,
        contractData: {},
      },

      initial: "Initial",

      states: {
        Initial: {
          always: [
            {
              target: "#contractSelector.Contract Selected",
              cond: "hasInitialContractId",
              actions: "assignInitialToSelected",
              description: `This is for when the Contract ID is supplied as an argument to the machine before it has started, e.g. from a URL query parameter`,
            },
            "Idle",
          ],
        },

        "Contract Selected": {
          states: {
            Initial: {
              always: "Loading Contract Data",
            },

            "Loading Contract Data": {
              invoke: {
                src: "loadContract",
                onDone: "Contract Load Complete",
                onError: {
                  target: "Contract Load Failure",
                  actions: "assignErrorInfo",
                },
              },

              states: {
                Processing: {
                  on: {
                    "Data Available": {
                      target: "Processing",
                      actions: "assignPartialContractData",
                      internal: true,
                      description: `New data is assigned to this machine's context as it is generated`,
                    },
                  },
                },
              },

              initial: "Processing",

              on: {
                "Data Loaded": "Contract Load Complete",
              },
            },

            "Contract Load Complete": {},
            "Contract Load Failure": {},
          },

          initial: "Initial",

          on: {
            "Replace Contract": {
              target: ".Initial",
              actions: [
                "assignReplacementContract",
                "clearContractData",
                "updateQueryString",
              ],
              description: `When a new Contract ID has been selected`,
              cond: "isContractReplacable",
            },
          },
        },
        Idle: {
          on: {
            "Select First Contract": {
              target: "Contract Selected",
              actions: ["assignFirstContract", "updateQueryString"],
            },
          },

          description: `Waiting for the first Contract ID to be entered`,
        },
      },
    },
    {
      actions: {
        assignInitialToSelected: assign({
          selectedContractId: (context) => context.initialContractId,
        }),
        assignFirstContract: assign({
          selectedContractId: (_, event) => event.data.firstContractId,
        }),
        assignReplacementContract: assign({
          selectedContractId: (_, event) => event.data.replacementContractId,
        }),
        assignErrorInfo: assign({
          error: (_, event) => event.data,
        }),
        assignPartialContractData: assign({
          contractData: (context, event) => ({
            ...context.contractData,
            ...event.data,
          }),
        }),
        clearContractData: assign({
          contractData: {},
        }),
        updateQueryString: (context) => {
          if (context.selectedContractId !== undefined) {
            const url = new URL(window.location.toString());
            url.searchParams.set("contractId", context.selectedContractId);
            window.history.replaceState(null, "", url.toString());
          }
        },
      },
      guards: {
        hasInitialContractId: (context) =>
          context.initialContractId !== undefined,
        isContractReplacable: () => true, // TODO
      },
      services: {
        loadContract: (context) => (send) => {
          const { selectedContractId: contractId } = context;

          const warp = WarpFactory.forMainnet();
          const contractDataStream = loadContractData(warp, contractId!);
          const contractDataStreamReader = contractDataStream.getReader();

          function processNext() {
            contractDataStreamReader.read().then(({ done, value }) => {
              if (done) {
                send({
                  type: "Data Loaded",
                });
                return;
              }

              send({
                type: "Data Available",
                data: value,
              });

              processNext();
            });
          }

          processNext();
        },
      },
    }
  );
