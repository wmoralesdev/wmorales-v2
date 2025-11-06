import type { ReactNode } from "react";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTerminalStore } from "@/lib/stores/terminal-store";
import { COMMANDS } from "../commands";
import type { Command } from "../types";

const WHITESPACE_REGEX = /\s+/;

export function useTerminal() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tabPressedCount, setTabPressedCount] = useState(0);
  const {
    commands,
    currentInput,
    commandHistory,
    setCurrentInput,
    addCommand,
    clearCommands,
    addToHistory,
    navigateHistory,
    resetHistoryIndex,
    clearHistory,
    loadHistoryFromStorage,
  } = useTerminalStore();

  // Load history on mount
  useEffect(() => {
    loadHistoryFromStorage();
  }, [loadHistoryFromStorage]);

  // Helper to handle history recall: !! (repeat last)
  const recallLastCommand = useCallback(
    (): string | null => commandHistory.at(-1) ?? null,
    [commandHistory]
  );

  // Helper to handle history recall: !<n> (by number)
  const recallCommandByNumber = useCallback(
    (num: number): string | null => {
      if (num > 0 && num <= commandHistory.length) {
        const historyIndex = commandHistory.length - num;
        return commandHistory[historyIndex] ?? null;
      }
      return null;
    },
    [commandHistory]
  );

  // Helper to handle history recall: !<prefix> (by prefix)
  const recallCommandByPrefix = useCallback(
    (prefix: string): string | null => {
      if (prefix.length === 0) {
        return null;
      }
      const lowerPrefix = prefix.toLowerCase();
      for (let i = commandHistory.length - 1; i >= 0; i--) {
        const cmd = commandHistory[i];
        if (cmd?.toLowerCase().startsWith(lowerPrefix)) {
          return cmd;
        }
      }
      return null;
    },
    [commandHistory]
  );

  const parseCommand = useCallback(
    (input: string): { command: string; args: string[] } => {
      const trimmed = input.trim();
      if (!trimmed) {
        return { command: "", args: [] };
      }

      // Helper to process !! (repeat last command)
      const processRepeatLast = (
        parseFn: (cmd: string) => { command: string; args: string[] }
      ): { command: string; args: string[] } | null => {
        const recalled = recallLastCommand();
        if (recalled) {
          return parseFn(recalled);
        }
        return { command: "", args: [] };
      };

      // Helper to process !<n> (by number)
      const processByNumber = (
        rest: string,
        parseFn: (cmd: string) => { command: string; args: string[] }
      ): { command: string; args: string[] } | null => {
        const num = Number.parseInt(rest, 10);
        if (Number.isNaN(num)) {
          return null;
        }
        const recalled = recallCommandByNumber(num);
        if (recalled) {
          return parseFn(recalled);
        }
        return null;
      };

      // Helper to process !<prefix> (by prefix)
      const processByPrefix = (
        rest: string,
        parseFn: (cmd: string) => { command: string; args: string[] }
      ): { command: string; args: string[] } | null => {
        const recalled = recallCommandByPrefix(rest);
        if (recalled) {
          return parseFn(recalled);
        }
        return null;
      };

      // Helper to process history recall syntax
      const processHistoryRecall = (
        inputValue: string,
        parseFn: (cmd: string) => { command: string; args: string[] }
      ): { command: string; args: string[] } | null => {
        if (!inputValue.startsWith("!")) {
          return null;
        }

        const rest = inputValue.slice(1);

        // !! - repeat last command
        if (rest === "!") {
          return processRepeatLast(parseFn);
        }

        // !<n> - by number
        const byNumberResult = processByNumber(rest, parseFn);
        if (byNumberResult) {
          return byNumberResult;
        }

        // !<prefix> - by prefix
        return processByPrefix(rest, parseFn);
      };

      // Handle history recall: !! (repeat last), !<n> (by number), !<prefix> (by prefix)
      const historyResult = processHistoryRecall(trimmed, parseCommand);
      if (historyResult) {
        return historyResult;
      }

      const parts = trimmed.split(WHITESPACE_REGEX);
      const command = parts[0]?.toLowerCase() ?? "";
      const args = parts.slice(1);

      return { command, args };
    },
    [recallLastCommand, recallCommandByNumber, recallCommandByPrefix]
  );

  const executeCommand = useCallback(
    (input: string): Command | null => {
      const { command, args } = parseCommand(input);

      addToHistory(input);
      resetHistoryIndex();

      if (command === "clear" || command === "cls") {
        clearCommands();
        return null;
      }

      if (!command) {
        return { input, output: "" };
      }

      const commandDef = COMMANDS[command];

      if (commandDef) {
        const output = commandDef.execute(args);
        if (output === "CLEAR") {
          clearCommands();
          return null;
        }
        return { input, output };
      }

      // Return null for error - component will handle error display
      return null;
    },
    [addToHistory, clearCommands, resetHistoryIndex, parseCommand]
  );

  const handleCommand = useCallback(
    // biome-ignore lint/nursery/noShadow: False positive - parameter doesn't shadow anything
    (input: string, onError: (input: string) => ReactNode) => {
      const { command: cmdName } = parseCommand(input);
      const command = executeCommand(input);

      if (command) {
        addCommand(command);
      } else if (cmdName !== "clear" && cmdName !== "cls") {
        // Check if this was a clear command (which returns null intentionally)
        // Handle error case - create error message in component
        addCommand({ input, output: onError(input) });
      }
      // If it was clear/cls, do nothing (screen already cleared)
    },
    [addCommand, executeCommand, parseCommand]
  );

  const getAutocompleteMatches = useCallback(
    (input: string) => {
      const { command } = parseCommand(input);
      if (!command) {
        return [];
      }

      return Object.entries(COMMANDS)
        .filter(([cmdName]) => cmdName.startsWith(command.toLowerCase()))
        .map(([cmdName, cmdDef]) => ({
          name: cmdName,
          description: cmdDef.descriptionKey
            ? cmdDef.description
            : cmdDef.description,
          fullCommand: cmdName,
        }));
    },
    [parseCommand]
  );

  const handleTab = useCallback(() => {
    const matches = getAutocompleteMatches(currentInput);

    if (matches.length === 1) {
      // Single match - complete it
      const { command } = parseCommand(currentInput);
      const rest = currentInput.slice(command.length).trim();
      setCurrentInput(matches[0].fullCommand + (rest ? ` ${rest}` : ""));
      setTabPressedCount(0);
    } else if (matches.length > 1) {
      // Multiple matches - show them on double tab
      setTabPressedCount((prev) => prev + 1);
      if (tabPressedCount >= 1) {
        // Show matches with descriptions
        const matchesOutput = (
          <div className="space-y-1">
            <div className="text-muted-foreground text-sm">
              Available commands:
            </div>
            <div className="ml-4 space-y-1 font-mono text-sm">
              {matches.map((match) => (
                <div className="space-x-2" key={match.name}>
                  <span className="text-cyan-600 dark:text-cyan-400">
                    {match.name}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    - {match.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
        addCommand({ input: currentInput, output: matchesOutput });
        setTabPressedCount(0);
      }
    }
  }, [
    currentInput,
    setCurrentInput,
    parseCommand,
    tabPressedCount,
    addCommand,
    getAutocompleteMatches,
  ]);

  const getGhostText = useCallback(() => {
    const matches = getAutocompleteMatches(currentInput);
    if (matches.length === 1 && currentInput.trim()) {
      const { command } = parseCommand(currentInput);
      const rest = currentInput.slice(command.length).trim();
      return matches[0].fullCommand + (rest ? ` ${rest}` : "");
    }
    return "";
  }, [currentInput, parseCommand, getAutocompleteMatches]);

  // Helper function to handle Ctrl/Cmd shortcuts
  const handleModifierShortcut = useCallback(
    (key: string, e: KeyboardEvent<HTMLInputElement>) => {
      const lowerKey = key.toLowerCase();
      if (lowerKey === "l") {
        e.preventDefault();
        clearCommands();
        setCurrentInput("");
      } else if (lowerKey === "u") {
        e.preventDefault();
        setCurrentInput("");
      } else if (lowerKey === "c") {
        e.preventDefault();
        addCommand({
          input: currentInput,
          output: <span className="text-muted-foreground">^C</span>,
        });
        setCurrentInput("");
      } else if (lowerKey === "k") {
        e.preventDefault();
        // Clear to end of line (just clear input for now)
        setCurrentInput("");
      }
    },
    [currentInput, setCurrentInput, clearCommands, addCommand]
  );

  // Helper function to handle arrow key navigation
  const handleArrowKey = useCallback(
    (direction: "up" | "down") => {
      const historyItem = navigateHistory(direction);
      if (historyItem !== null) {
        setCurrentInput(historyItem);
      }
    },
    [navigateHistory, setCurrentInput]
  );

  // Helper to handle non-modifier keys
  const handleNonModifierKey = useCallback(
    (
      key: string,
      onError: (input: string) => ReactNode,
      e: KeyboardEvent<HTMLInputElement>
    ) => {
      if (key === "Enter") {
        handleCommand(currentInput, onError);
        setCurrentInput("");
        setTabPressedCount(0);
      } else if (key === "ArrowUp") {
        e.preventDefault();
        handleArrowKey("up");
      } else if (key === "ArrowDown") {
        e.preventDefault();
        handleArrowKey("down");
      } else if (key === "Tab") {
        e.preventDefault();
        handleTab();
      }
    },
    [currentInput, handleCommand, handleArrowKey, handleTab, setCurrentInput]
  );

  const createHandleKeyDown = useCallback(
    (onError: (input: string) => ReactNode) =>
      (e: KeyboardEvent<HTMLInputElement>) => {
        // Reset tab count on any other key
        if (e.key !== "Tab") {
          setTabPressedCount(0);
        }

        if (e.ctrlKey || e.metaKey) {
          // Handle Ctrl/Cmd shortcuts
          handleModifierShortcut(e.key, e);
        } else {
          // Handle non-modifier keys
          handleNonModifierKey(e.key, onError, e);
        }
      },
    [handleModifierShortcut, handleNonModifierKey]
  );

  const createHandleSuggestionClick = useCallback(
    (createErrorOutput: (input: string) => ReactNode) => (command: string) => {
      handleCommand(command, createErrorOutput);
      setCurrentInput("");
      inputRef.current?.focus();
    },
    [handleCommand, setCurrentInput]
  );

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return {
    commands,
    currentInput,
    commandHistory,
    inputRef,
    setCurrentInput,
    handleCommand,
    createHandleKeyDown,
    createHandleSuggestionClick,
    handleTab,
    focusInput,
    clearHistory,
    getGhostText,
  };
}
