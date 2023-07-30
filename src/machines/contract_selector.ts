import { createMachine, assign } from "xstate";

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
    };

export const contractSelectorMachine = (initialContractId?: string) =>
  createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QGMD2A7ALgJwIbMwGUwAbMA1bAOgEl0BLTe3EgYgG0AGAXUVAAdUsRvQx8QAD0QA2AExUAzNIAsnaQEZ1y2QA510hQFZlAGhABPREaqdZ6zp0NaFmgOzqAnAF8vZtFjwCYjIKajoRFg51XiQQQWEmMVipBB0PKh1lV2ydPWVtBVcdM0sEdWyqLNdZThdtHU4i5R8-DBx8IlJyTEoqAGE2wMwAAmDuyFoGJkiuGIEhESTQFOkdBRtZaQ8PdVllHUNpDRLEe3WGnV1lQ2y92oUWkH92oK7Q-sGO0bfMCcJ+XAAdwY6CgwwGAS+AFl8AALejoMCsCAYMBUBEAN1QAGs0c8hmN3hCXiNCb8IFR-kCQWDiUNhjDkPDEQhMahkLhEuhZrNxPFFuhxCtbFQtuVHAoFB4NMcLIhZK5OFRNno7HtsuoFAdHviOmTenSvmSJjQIGRWAAlMD8Ej4MDgz4EXmxflcoWIDy1GzSvTlQw6aSuQwnMoGKgeJR7G6yKX7Tg6HWOzohHphM1IsnDABi9GwsBGhqdPD5CzdyXlhnSksMLnjWkD+gUIfVosKRXsHiyu39Pl8IHQqAgcHEuteKcoJYSokF5bKykUKjUmnqjeMIYAtJrXFQzoZOLt96sXK5E5Cx91euFpiRJwL3WVZPJOBGdK5VEdrpkm3KEOvlOkNCKFwPGqDxH28PtR2TC9qELUkfkgW8y2WRBjHUHcDDUAxXE7NYPA3VRFFUPZ1EuWQwOkYxTxJfVYKTb4UxNKZmBvF1S2ne9VnQ1QdkOKU1AUZRpBDLId2uZQjC1TJGmqaRqIJH4DXo40KSpYEEVpejGWZMAkI42d-XSRssMKXCpRDRtlSE7sNEMR8ahPSCk1oj4z3gxiKVNMg9KWSQZADZVJSUXIjjWQ4Q0E+RBOqWQ902I5XAeJy3JcrzdLYqdfJSXZpHDUjn1UQranwn9NnSNI9FcQDOHyLVey8IA */
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
            },
            "Idle",
          ],
        },

        "Contract Selected": {
          states: {
            Initial: {
              always: "Spawning Contract Machine",
            },
            "Spawning Contract Machine": {
              invoke: {
                src: "spawnContractMachine",
                onDone: "Idle",
              },
            },
            Idle: {
              on: {
                "Replace Contract": {
                  target: "#contractSelector.Contract Selected",
                  actions: "assignReplacementContract",
                },
              },
            },
          },

          initial: "Initial",
        },
        Idle: {
          on: {
            "Select First Contract": {
              target: "Contract Selected",
              actions: "assignFirstContract",
            },
          },
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
