import { createMachine, assign } from "xstate";
import { ContractDataFull } from "../types/contract";

type Context = {
  initialContractId?: string;
  selectedContractId?: string;
  contractData: Partial<ContractDataFull>;
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
    };

export const contractManagerMachine = (initialContractId?: string) =>
  createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QGMD2A7ALgJwIbMwGUwAbMA1bAOgEl0BLTe3EgYgG0AGAXUVAAdUsRvQx8QAD0QBaACwA2KvIDs82bIBMADjXLlnDQFYANCACeMjQE4qVgMwBGeRpedDnBw9V2Avj9NoWHgExGQU1HQiLBwOvEgggsJMYvFSCM5Usg5ahlYOdoYOHoZZphYITlpUWkZ68loeGgVWGn4BGDj4RKTkmJRUAMIdwZgABKG9kKwASmD8JPhgo0NBXVxxAkIiKaBp9oq5VlacVlp2bs6yZTKGGlSGylaydvJ2yoaG8hdtIIGdIT1woNhl1xoDMJBaAwmNF1uJEtt0OI0u9ZLYXlp7EYHLIrLlrghcbZ8pwVMoXIZHDkfn8RhMgSt-mN6RCIFQADKoXAQejoKDLEEEUYAEVwmFwrAgGDAVF5ADdUABrGW0ros-qMkZgsKsjlcnl8gWrIWi8UIeWoZBi0TodZw+II5JI1KIckOTKuFraM75K7mRCyW5UZR2HRfc4OB5GGmC7o6-o0CBkVgs0YAMXo2FgY01ax48K2TuRiDsjiUpPcIb0DhcgYJGkDtnkOK0Ok4IfkVhjxrjvQ1se1kzZnO5vP5uZNYolYGw2H68zFADNKABbKiqgHx6gT5ngyEjg3jgem3Dm9AKq1Ou35h2Fm3FhBWepUOwaV6UkqqY7yAmBmyvTEtFxWRMU4N5uyZdVtwHFl931McjSZEUpyoAAFOdkDgYQ+VYE9RgAQTlXB6AWAAjMh7U2JJ7xdBBWxsApQ3bKxlCAlQ7HrQpMk4DxW3eE5lAcFo-H8EB0FQCA4HEDde3CAtqJ2SQZCeJRVHUbRdH0IwCWkFxlHuSstFY9xIyAiC6XBBNoWYEh5MRB9MXuTgGgKJx6lkHiTH9BBpHsao31cFzfUMLRzLVSzoJ7QcCEgOyi1o14Di+XJagaIwvPKaQcU4KgK08DR8pyJ5QtEmSoOBKLYLZSIYVs28FOdXZXUpF8hM4BRO1uNSdJxXKG1Udq3iMpplDCzc+0ipCqr1UdDR3ZDxTimimvSID7mSloHjSj4CU8RQvTsTQeNOIzSzG2S+kmrVpoPBD5pPNCMKwsclsUlFX3WtxNtYgwdu86wbH0TQ3k0M5yUMc7yvm6b5oPAUV3mMAIVexqlPSFim2yDxcROZ4NAJW53TfLJnjcLIQshiLaCTMAUYfLLAbsJ8CrcMDw3yesFHuArQxKZwcVkZRZEprcKqmvc2Vh-V02IkgAFdsFp+r7NovFDFytrcTeMnmwJwTg1xI4QMjLx5HkESfCAA */
      id: "contractSelector",

      predictableActionArguments: true,
      tsTypes: {} as import("./contract_manager.typegen").Typegen0,

      schema: {
        context: {} as Context,
        events: {} as Events,
      },

      context: {
        initialContractId,
        selectedContractId: undefined,
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
            },

            "Contract Load Complete": {},
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
