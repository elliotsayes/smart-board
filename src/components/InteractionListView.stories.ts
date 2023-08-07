import type { Meta, StoryObj } from "@storybook/react";

import InteractionListView from "./InteractionListView";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "App/InteractionListView",
  component: InteractionListView,
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
} satisfies Meta<typeof InteractionListView>;

export default meta;
type Story = StoryObj<typeof meta>;

const exampleInteractions = (n: number) =>
  Array.from({ length: n }, () => ({
    id: Math.random().toString(36).substring(36),
    fee: {
      winston: "47763720",
      ar: "",
    },
    tags: [
      {
        name: "App-Name",
        value: "SmartWeaveAction",
      },
      {
        name: "Contract",
        value: "aeQgDoPgdixT7tjNXC9X4x6NRjGjAmsvUndl3_EHlto",
      },
      {
        name: "Input",
        value: '{"function":"setName","name":"multi-interact-1"}',
      },
      {
        name: "App-Name",
        value: "SmartWeaveAction",
      },
      {
        name: "Contract",
        value: "7M9mw-fU2DnmLrdX8KtJUToC91AG8Ws0hf2ic2TcqKM",
      },
      {
        name: "Input",
        value: '{"function":"setName","name":"multi-interact-2"}',
      },
      {
        name: "App-Name",
        value: "SmartWeaveAction",
      },
      {
        name: "Contract",
        value: "kwaHdtmWR-btnMvswyLCL_zKXANUEWs7uBy9bQeGcdw",
      },
      {
        name: "Input",
        value: '{"function":"setName","name":"multi-interact-3"}',
      },
      {
        name: "App-Name",
        value: "SmartWeaveAction",
      },
      {
        name: "App-Version",
        value: "0.3.0",
      },
      {
        name: "SDK",
        value: "Warp",
      },
      {
        name: "Contract",
        value: "4Zr032rLb53Nxk5JQrLrEnNbQY97Rch7clADqchZdho",
      },
      {
        name: "Input",
        value: '{"function":"setName","name":"multi-interact-0"}',
      },
    ],
    block: {
      id: "1glp489hEFLKGLv-57tsXqpdehkOALbqV4Qng2gh2zFwud7bVKInV-uGVaWMFfkc",
      height: 1105785,
      timestamp: 1674692562,
      previous: "",
    },
    owner: {
      address: "7waR8v4STuwPnTck1zFVkQqJh5K9q9Zik4Y5-5dV7nk",
      key: "",
    },
    parent: {
      id: "",
    },
    quantity: {
      winston: "0",
      ar: "",
    },
    bundledIn: {
      id: "",
    },
    recipient: "",
    sortKey:
      "000001105785,0000000000000,bc0336133aa7b1847068eae0c93111da5931f81989584a84a856825cbbd44b1c",
    confirmationStatus: "confirmed",
    anchor: "",
    signature: "",
    data: {
      size: 0,
      type: "",
    },
  }));

export const SingleInteraction: Story = {
  args: {
    items: exampleInteractions(1),
  },
};

export const HundredInteraction: Story = {
  args: {
    items: exampleInteractions(100),
  },
};

export const ThousandInteraction: Story = {
  args: {
    items: exampleInteractions(1000),
  },
};
