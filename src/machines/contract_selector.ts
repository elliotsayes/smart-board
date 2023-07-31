import { createMachine, assign } from "xstate";
import {
  ContractInteractionHistory,
  ContractMeta,
  ContractState,
  ContractStateHistory,
} from "../types";

type Context = {
  initialContractId?: string;
  selectedContractId?: string;
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
      data: {
        meta?: ContractMeta;
        initialState?: ContractState;
        currentState?: ContractState;
        interactionHistory?: ContractInteractionHistory;
        stateHistory?: ContractStateHistory;
      };
    };

export const contractSelectorMachine = (initialContractId?: string) =>
  createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QGMD2A7ALgJwIbMwGUwAbMA1bAOgEl0BLTe3EgYgG0AGAXUVAAdUsRvQx8QAD0QBaACwA2KvIDs82bIBMADjXLlnDQFYANCACeMjQE4qVgMwBGeRpedDnBw9V2Avj9NoWHgExGQU1HQiLBwOvEgggsJMYvFSCM5Usg5ahlYOdoYOHoZZphYITlpUWkZ68loeGgVWGn4BGDj4RKTkmJRUAMIdwZgABKG9kKwASmD8JPhgo0NBXVxxAkIiKaBp9oq5VlacVlp2bs6yZTKGGlSGylaydvJ2yoaG8hdtIIGdIT1woNhl1xoDMJBaAwmNF1uJEtt0OI0u9ZLYXlp7EYHLIrLlrghcbZ8pwVMoXIZHDkfn8RhMgSt-mN6RCIFQADKoXAQejoKDLEEEUYAEVwmFwrAgGDAVF5ADdUABrGW0ros-qMkZgsKsjlcnl8gWrIWi8UIeWoZBi0TodZw+II5JI1KIZQOO7Wd0OEoGb3yEzmRCyW5UZR2HRfc7e8kPGmC7o6-o0CBkVgs0YAMXo2FgY01ax48K2TuRiDsjiUpPcYb07o0wYJ9cMtnkOK0Ok4YfkVjjxoTvQ18e1kzZnO5vP5+ZNYolYGw2H68zFADNKABbKiqgGJ6hT5ngyFjg2Toem3Dm9AKq1Ou2Fh3Fm2lhD2OxUOwuVvhjTOUkE4MOTJPFkLQuzcJxy17Jl1V3IcWUPfUJyNJkRRnKgAAUF2QOBhD5Vgz1GABBOVcHoBYACMyHtTYkkfF0EHbGwCnDTsrGULQFDDRtCkyTgPHbd4TjdFo-H8EB0FQCA4HELd+3CIsaJ2SQZCeJRVHUbRdH0IwCWkFxlHuasQJyYp2MgulwSTaFmBIeTESfTF7k4BoCicepZF4gNymkexqm-VxnPyYMtDMtULJgvthwISBbJLOjXgOL5clqBojE8mQcU4Kgq08DQcpyJ5gtEmToOBCK4LZSIYRs+8FOdXZXUpN8HGOBRu1uNSdJxLL61UThnjY8k3hC7cB3C5Dyr1cdDT3FDxRi2j6vSdj7kSloHhSj4CU8RQWiaTReNOECIKK+MSpmiaj0Qmaz3QzDsInebFJRd8VrcNa2IMTbAwQawbH0TQ3k0M4Y2G2S+jGrUJuumdRiPaKarsuLWJbbIPFxE5ng0AlbgA78smeNwskMQr2j7ErkzIR66qUhBpGa0M7CsZwincF5OEcOxGwUe5cvDEpmfUZRZFBs7YIPNkZqPTMSJIABXbAwCpp8Wky4pziZ9HWyx76caoPGTnLVj-W9ESfCAA */
      id: "contractSelector",

      predictableActionArguments: true,
      tsTypes: {} as import("./contract_selector.typegen").Typegen0,

      schema: {
        context: {} as Context,
        events: {} as Events,
      },

      context: {
        initialContractId,
        selectedContractId: undefined,
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
                onDone: "Contract Data Loaded",
                onError: "Contract Load Failure",
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
            },

            "Contract Data Loaded": {},
            "Contract Load Failure": {},
          },

          initial: "Initial",

          on: {
            "Replace Contract": {
              target: ".Initial",
              actions: "assignReplacementContract",
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
      },
    }
  );
