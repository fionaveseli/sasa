import type { JSX } from "react";

export interface TabsType {
  key: string;
  value: string;
  label: string | JSX.Element;
  component: JSX.Element;
}
