import type { Meta, StoryObj } from "@storybook/react";

import Dashboard from "./Dashboard";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "App/Dashboard",
  component: Dashboard,
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
} satisfies Meta<typeof Dashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

const generateFakeInteractions = (n: number) => 
  Array.from(
    { length: n }, 
    (_, i) => ({
      id: i.toString(),
      anchor: '123',
      signature: '123',
      recipient: '123',
      owner: {
        key: '123',
        address: 'abc123'
      },
      fee: {
        winston: '0',
        ar: '0'
      },
      quantity: {
        winston: '0',
        ar: '0'
      },
      data: {
        size: 0,
        type: '',
      },
      tags: [],
      block: {
        id: '0',
        height: 0,
        timestamp: 0 + i * 24 * 60 * 60 * 1000,
        previous: '0'
      },
      parent: {
        id: '122',
      },
      bundledIn: {
        id: '',
      }
    })
  );


// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    contractData: {
      interactionHistory: generateFakeInteractions(2),
    }
  },
};
