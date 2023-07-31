import { DateType } from "vis-timeline/esnext";

export const utcMs = (date: DateType): number => {
  if (typeof date === "number") return date;
  if (typeof date === "string") return new Date(date).getTime();
  if (date instanceof Date) return date.getTime();
  throw Error(`Invalid date type: ${date}`);
};
