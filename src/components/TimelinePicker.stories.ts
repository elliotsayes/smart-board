import type { Meta, StoryObj } from "@storybook/react";

import TimelinePicker from "./TimelinePicker";
import { TimelineItem } from "vis-timeline/esnext";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "App/TimelinePicker",
  component: TimelinePicker,
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
} satisfies Meta<typeof TimelinePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const ZeroItems: Story = {
  args: {
    items: [],
  },
};

const oneItem: TimelineItem[] = [
  {
    id: 0,
    start: Date.UTC(2012, 0, 1),
    content: "",
    type: "point",
  },
];

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const OneItem: Story = {
  args: {
    items: oneItem,
  },
};

const items100: TimelineItem[] = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  start: Date.UTC(2010 + Math.floor(i / 12), i % 12, 1),
  content: "",
  type: "point",
}));

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const HundredItems: Story = {
  args: {
    items: items100,
  },
};

const items1k: TimelineItem[] = Array.from({ length: 1_000 }, (_, i) => ({
  id: i,
  start: Date.UTC(1900 + Math.floor(i / 12), i % 12, 1),
  content: "",
  type: "point",
}));

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const ThousandItems: Story = {
  args: {
    items: items1k,
  },
};

const items10k: TimelineItem[] = Array.from({ length: 10_000 }, (_, i) => ({
  id: i,
  start: Date.UTC(1000 + Math.floor(i / 12), i % 12, 1),
  content: "",
  selectable: true,
  type: "point",
}));

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const TenThousandItems: Story = {
  args: {
    items: items10k,
  },
};
