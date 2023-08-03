import type { Meta, StoryObj } from "@storybook/react";

import ContractManager from "./ContractManager";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "App/ContractManager",
  component: ContractManager,
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
} satisfies Meta<typeof ContractManager>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const QuietContract: Story = {
  args: {
    initialContractId: "aeQgDoPgdixT7tjNXC9X4x6NRjGjAmsvUndl3_EHlto",
  },
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const BusyContract: Story = {
  args: {
    initialContractId: "-8A6RexFkpfWwuyVO98wzSFZh0d6VJuI-buTJvlwOJQ",
  },
};
