import type { Meta, StoryObj } from "@storybook/react";

import InteractionDetails from "./InteractionDetails";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "App/InteractionDetails",
  component: InteractionDetails,
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
} satisfies Meta<typeof InteractionDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const BlankInteraction: Story = {
  args: {
    interactionIndex: 0,
    interaction: {
      id: "",
      anchor: "",
      signature: "",
      recipient: "",
      owner: {
        address: "",
        key: "",
      },
      fee: {
        winston: "",
        ar: "",
      },
      quantity: {
        winston: "",
        ar: "",
      },
      data: {
        size: 0,
        type: "",
      },
      tags: [],
      block: {
        id: "",
        timestamp: 0,
        height: 0,
        previous: "",
      },
      parent: {
        id: "",
      },
      bundledIn: {
        id: "",
      },
    },
  },
};
