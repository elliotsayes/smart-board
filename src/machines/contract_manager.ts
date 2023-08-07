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
      /** @xstate-layout N4IgpgJg5mDOIC5QGMD2A7ALgJwIbMwGUwAbMA1bAOgEl0BLTe3EgYgG0AGAXUVAAdUsRvQx8QAD0QBaACwA2KvIDs82bIBMADjXLlnDQFYANCACeMjQE4qVgMwBGeRpedDnBw9V2Avj9NoWHgExGQU1HQiLBwOvEgggsJMYvFSCM5Usg5ahlYOdoYOHoZZphYITlpUWkZ68loeGgVWGn4BGDj4RKTkmJRUAMIdwZgABKG9kKwASmD8JPhgo0NBXVxxAkIiKaBp9rJUhlpFWvoang6FZTLyhtU6yuqyVlpZyhrybSCBnSE94YNhl1xv9MJBaAwmNF1uJEtt0OI0soSrY7PV7EYHM9ctcEM9bPlOCp3kZHDkvj8RhMAStfmNqWCIFQADKoXAQejoKDLIEEUYAEVwmFwrAgGDAVE5ADdUABrCWUroM-q0kYgsKMllsjlcnmrPmC4UIaWoZBC0TodYw+Jw5II1KId4OTKuFraLSOOyyXGyQwaKjKOw6eScOzFd6GCm87oalXR9WTJms9mc7mq4GGkVgbDYfrzIUAM0oAFsqIq-rHqOm+QzwcmdWn45njegZWa7VaeLCtnbEYgLpxMnYrEcvYSFPIfSHMqdzl5SbIPFH9THenGVwmCHXtam9XSBUKRZnRvXINbNkkLX2EPY7lorCOHBpOETZHYNMofYUqE0GqHQw+Ya+P43zRsqVbxrWSY7rq1ZjJmVAAAq5sgcDCFyrDHgAglKuD0AsABGZDngkPZXg6CBaPeVAFEGnDKFYyivCodi4pimQvtkpzuIxDgtMudLgbQEBkKwDKjAAYvQ2CwGMcEkba5G7IgdiOEoRLuIGehPhovpsb6tjyFiVEhoG8hWH4IHoKgEBwOI5aruE3aXjskgyFYBwqGomg6LIegGCY5iWIu1RHJ4djKHxXicLIAlUqC-SRFCJDOfC17Ue4DQFE49SLm4uLSPY1QfK4WX5L6WhxUqCUQRuUGpb2FHyGihwhrktQNEYgXlNIlx2DR7yaHknCnPYNRVRWa61fuUEQlEKU2mRrlIoY-WOFYMXyOZfqqN6QUIL1BwGH5IZvkx7wRRNjl9NNaqzfWu5wQewoNUpbnpK8rVuC0hhMQF3X9k4tguF6qmvMiv2RiBDlCU990wY2G4Ichppoamr3LY675fe1v2dYYAMINYNj6JoEU+RFRhXbDkGguCT31jyxbzGAYIY-aynpIxhnZB4zycB5764n6zofFkb5uFkRzUzVgJ1XTTIM9qkl4SQACu2BgOz15FNz+QuAxTS5AYGjC+8hwvC4lx5EZwHtCuQk0CJWuLS5HPvb1JPDs4RTuGiob5Ppigi0GJQ++ojyWT4QA */
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
              actions: ["assignReplacementContract", "clearContractData"],
              description: `When a new Contract ID has been selected`,
              cond: "isContractReplacable",
            },
          },
        },
        Idle: {
          on: {
            "Select First Contract": {
              target: "Contract Selected",
              actions: "assignFirstContract",
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
