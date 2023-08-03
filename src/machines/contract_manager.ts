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
      /** @xstate-layout N4IgpgJg5mDOIC5QGMD2A7ALgJwIbMwGUwAbMA1bAOgEl0BLTe3EgYgG0AGAXUVAAdUsRvQx8QAD0QBaACwA2KvIDs82bIBMADjXLlnDQFYANCACeMjQE4qVgMwBGeRpedDnBw9V2Avj9NoWHgExGQU1HQiLBwOvEgggsJMYvFSCM5Usg5ahlYOdoYOHoZZphYITlpUWkZ68loeGgVWGn4BGDj4RKTkmJRUAMIdwZgABKG9kKwASmD8JPhgo0NBXVxxAkIiKaBp9oq5VlacVlp2bs6yZTKGGlSGylaydvJ2yoaG8hdtIIGdIT1woNhl1xoDMJBaAwmNF1uJEtt0OI0u9ZLYXlp7EYHLIrLlrghcbZ8pwVMoXIZHDkfn8RhMgSt-mN6RCIFQADKoXAQejoKDLEEEUYAEVwmFwrAgGDAVF5ADdUABrGW0ros-qMkZgsKsjlcnl8gWrIWi8UIeWoZBi0TodZw+II5JI1KIckOTKuFraM75K7mRCyW5UZR2HRfc4OB5GGmC7o6jWx7WTNmc7m8-ma0GmiVgbDYfrzMUAM0oAFsqKqAfHqJmhSzIamDRnE9nzegFVanXaePCtk7kYhPEVMnY8WcsucFPICQpOJktG6vEY7LIPDHjXHegmN0mCA39emjUyRWLcFQAAr55BwYR81jZ0YAQTluHoCwARmR7ZskjaBwgtExKgClDThHmULQFBDAlsUyTgPEA94TmUBwWnXJl1QiCAyFYFlRgAMXobBYDGWtMG-BI+z-F0EDsRwlFJdwQz0BwXEDGDA1seQcUAr4Q3kKx0LpcFt2PesUwPQ0yJPcV71PUZG0gCjHWo3ZEHsQxqiOQoNHgtQ7A0ZQZ0KKgmgaThzlHewLL8fwQHQVAIDgcRK03cJe1-HZJBkJ4lFUdRtF0fQjAJaQXGUe4mNUE5AM4VdDCEtURIiaFmBIDzEX-ID3AaAonHqVc3FC+xqg0ZxdNy31DC0RKqy3GtE3EjL+xo14Di+XJagaIwTH9BBpBxOdGKKZw3myJparcvoGp3cSoSidKHSoryUUpYDULi+QBNufzQpxKgDFkaLngg8k3kmzDgVm8F9zTKSW1PZrVO89JIPuDqWgebqPgJTxFC9RxZC0SMag0Z4LuSq6xJuiS7ubHdswvK8b3TJ6VtdAz3rcT6IIMH6+usGx9E0N5NDOckErs1zLukubpMbAVS3mMAITR501PSKwIqsbiGhxY4ngMglbndMqsmeNwsmqiHqyhrU6cTBn8NfEgAFdsDANn-yKLmqHycKWmaAwNGF8l7lOFxIzybjfCp2NLpobDNaWzz2ZegaidHZwincF4LPyDiDg0fIcgUYP1GUWRbJ8IA */
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
        assignErrorInfo: assign({
          error: (_, event) => event.data,
        }),
        assignPartialContractData: assign({
          contractData: (context, event) => ({
            ...context.contractData,
            ...event.data,
          }),
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
