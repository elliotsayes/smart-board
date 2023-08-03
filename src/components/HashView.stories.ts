import type { Meta, StoryObj } from "@storybook/react";

import HashView from "./HashView";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "App/HashText",
  component: HashView,
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
} satisfies Meta<typeof HashView>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    // My personal wallet address
    hash: "0cQJ5Hd4oCaL57CWP-Pqe5_e0D4_ZDWuxKBgR9ke1SI",
    copy: true,
  },
};
