import type { ReactNode } from "react";

export type Command = {
  input: string;
  output: string | ReactNode;
};

export type CommandDefinition = {
  description: string;
  execute: () => string | ReactNode;
};

