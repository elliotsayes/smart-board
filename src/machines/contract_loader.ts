import { createMachine } from "xstate";

type Context = {
  contractId?: string;
};

type Events = {
  type: "eventType";
};

export const contractLoaderMachine = (contractId: string) =>
  createMachine({
    id: "contractLoader",
    tsTypes: {} as import("./contract_loader.typegen").Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    context: {
      contractId,
    },
    initial: "initialState",
    states: {
      initialState: {},
    },
  });
