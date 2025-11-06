"use client";

function EchoOutput({ text }: { text: string }) {
  return <div className="text-slate-700 dark:text-gray-300">{text}</div>;
}

export const echoCommand = {
  description: "Print text to terminal",
  descriptionKey: "terminal.echoUsage",
  usage: "echo <text>",
  category: "system" as const,
  execute: (args?: string[]) => {
    if (!args || args.length === 0) {
      // Unix-like behavior: echo without args prints empty line
      return <div className="text-slate-700 dark:text-gray-300">&nbsp;</div>;
    }
    return <EchoOutput text={args.join(" ")} />;
  },
};

