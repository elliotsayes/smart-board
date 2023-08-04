import type { Meta, StoryObj } from "@storybook/react";

import ContractHeader from "./ContractHeader";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "App/ContractHeader",
  component: ContractHeader,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    //
  },
} satisfies Meta<typeof ContractHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    contractType: "wasm",
    owner: "NdZ3YRwMB2AMwwFYjKn1g88Y9nRybTo0qhS1ORq_E7g",
    txId: "-8A6RexFkpfWwuyVO98wzSFZh0d6VJuI-buTJvlwOJQ",
    srcTxId: "ngMml4jmlxu0umpiQCsHgPX2pb_Yz6YDB8f7G6j-tpI",
    src: "export function handle(state, action) {\r\n  // TODO\r\n}",
  },
};
