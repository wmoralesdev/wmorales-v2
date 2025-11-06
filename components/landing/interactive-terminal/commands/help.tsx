"use client";

import { useTranslations } from "next-intl";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { COMMANDS } from "./index";
import type { CommandCategory } from "../types";

const categoryOrder: CommandCategory[] = ["profile", "system", "navigation", "fun"];
const categoryLabels: Record<CommandCategory, string> = {
  profile: "Profile",
  system: "System",
  navigation: "Navigation",
  fun: "Fun",
};

function HelpOutput({ commandName }: { commandName?: string }) {
  const t = useTranslations("terminal");

  // If specific command help requested
  if (commandName) {
    const cmd = COMMANDS[commandName.toLowerCase()];
    if (!cmd) {
      return (
        <div className="text-red-600 dark:text-red-400">
          {t("notFound", { input: commandName })}
        </div>
      );
    }

    const description = cmd.descriptionKey
      ? t(cmd.descriptionKey as never)
      : cmd.description;

    const examples = cmd.examplesKey ? t(cmd.examplesKey as never) : undefined;

    return (
      <div className="space-y-2">
        <div className="font-semibold text-green-600 dark:text-green-400">
          {commandName}
        </div>
        <div className="ml-4 text-slate-700 dark:text-gray-300">
          {description}
        </div>
        {cmd.usage && (
          <div className="ml-4 font-mono text-sm text-slate-600 dark:text-gray-400">
            {cmd.usage}
          </div>
        )}
        {examples && (
          <div className="ml-4 mt-2 space-y-1">
            <div className="text-xs font-semibold text-slate-600 dark:text-gray-400">
              Examples:
            </div>
            <div className="font-mono text-xs text-slate-600 dark:text-gray-400">
              {examples}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show all commands grouped by category
  const commandsByCategory: Record<CommandCategory, Array<[string, typeof COMMANDS[string]]>> = {
    profile: [],
    system: [],
    navigation: [],
    fun: [],
  };

  // Group commands by category
  Object.entries(COMMANDS).forEach(([name, cmd]) => {
    const category = cmd.category || "system";
    if (category in commandsByCategory) {
      commandsByCategory[category].push([name, cmd]);
    }
  });

  return (
    <div className="space-y-4">
      <div className="font-semibold text-green-600 dark:text-green-400">
        {t("helpTitle")}
      </div>

      {/* Commands grouped by category */}
      {categoryOrder.map((category) => {
        const commands = commandsByCategory[category];
        if (commands.length === 0) return null;

        return (
          <div key={category} className="ml-4 space-y-1.5">
            <div className="text-xs font-semibold text-muted-foreground uppercase">
              {categoryLabels[category]}
            </div>
            {commands.map(([name, cmd]) => {
              const description = cmd.descriptionKey
                ? t(cmd.descriptionKey as never)
                : cmd.description;

              return (
                <div key={name} className="text-sm text-slate-700 dark:text-gray-300">
                  <span className="text-cyan-600 dark:text-cyan-400">{name}</span>
                  {cmd.aliases && cmd.aliases.length > 0 && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({cmd.aliases.join(", ")})
                    </span>
                  )}
                  {" - "}
                  {description}
                </div>
              );
            })}
          </div>
        );
      })}

      <div className="mt-4 space-y-2">
        <div className="font-semibold text-green-600 dark:text-green-400">
          {t("helpShortcuts")}
        </div>
        <div className="ml-4 space-y-1.5 text-sm text-slate-700 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <span>{t("shortcutEnter")}:</span>
            <KbdGroup>
              <Kbd>⏎</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center gap-2">
            <span>{t("shortcutUpDown")}:</span>
            <KbdGroup>
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center gap-2">
            <span>{t("shortcutTab")}:</span>
            <KbdGroup>
              <Kbd>Tab</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center gap-2">
            <span>{t("shortcutCtrlL")}:</span>
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>L</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center gap-2">
            <span>{t("shortcutCtrlU")}:</span>
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>U</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center gap-2">
            <span>{t("shortcutCtrlC")}:</span>
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>C</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center gap-2">
            <span>{t("shortcutCtrlK")}:</span>
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <div className="font-semibold text-green-600 dark:text-green-400">
          {t("helpExamples")}
        </div>
        <div className="ml-4 whitespace-pre-line font-mono text-sm text-slate-600 dark:text-gray-400">
          {t("helpExample")}
        </div>
      </div>
    </div>
  );
}

export const helpCommand = {
  description: "Show available commands",
  descriptionKey: "terminal.helpUsage",
  usage: "help [command]",
  category: "system" as const,
  execute: (args?: string[]) => <HelpOutput commandName={args?.[0]} />,
};
