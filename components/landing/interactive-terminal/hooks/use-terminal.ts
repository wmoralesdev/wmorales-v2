import type { ReactNode } from "react";
import { type KeyboardEvent, useCallback, useRef } from "react";
import { useTerminalStore } from "@/lib/stores/terminal-store";
import { COMMANDS } from "../commands";
import type { Command } from "../types";

export function useTerminal() {
  const inputRef = useRef<HTMLInputElement>(null);
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
  } = useTerminalStore();

  const executeCommand = useCallback(
    (input: string): Command | null => {
      const trimmedInput = input.trim().toLowerCase();

      addToHistory(input);
      resetHistoryIndex();

      if (trimmedInput === "clear") {
        clearCommands();
        return null;
      }

      const command = COMMANDS[trimmedInput];

      if (command) {
        return { input, output: command.execute() };
      }
      if (trimmedInput === "") {
        return { input, output: "" };
      }
      // Return null for error - component will handle error display
      return null;
    },
    [addToHistory, clearCommands, resetHistoryIndex],
  );

  const handleCommand = useCallback(
    (input: string, createErrorOutput: (input: string) => ReactNode) => {
      const command = executeCommand(input);
      if (command) {
        addCommand(command);
      } else {
        // Handle error case - create error message in component
        addCommand({ input, output: createErrorOutput(input) });
      }
    },
    [addCommand, executeCommand],
  );

  const handleTab = useCallback(() => {
    const matches = Object.keys(COMMANDS).filter((cmd) =>
      cmd.startsWith(currentInput.toLowerCase()),
    );
    if (matches.length === 1) {
      setCurrentInput(matches[0]);
    }
  }, [currentInput, setCurrentInput]);

  const createHandleKeyDown = useCallback(
    (createErrorOutput: (input: string) => ReactNode) =>
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          handleCommand(currentInput, createErrorOutput);
          setCurrentInput("");
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          const historyItem = navigateHistory("up");
          if (historyItem !== null) {
            setCurrentInput(historyItem);
          }
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          const historyItem = navigateHistory("down");
          if (historyItem !== null) {
            setCurrentInput(historyItem);
          }
        } else if (e.key === "Tab") {
          e.preventDefault();
          handleTab();
        }
      },
    [currentInput, handleCommand, handleTab, navigateHistory, setCurrentInput],
  );

  const createHandleSuggestionClick = useCallback(
    (createErrorOutput: (input: string) => ReactNode) =>
      (command: string) => {
        handleCommand(command, createErrorOutput);
        setCurrentInput("");
        inputRef.current?.focus();
      },
    [handleCommand, setCurrentInput],
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
  };
}
