import type { ReactNode } from "react";
import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { useTerminalStore } from "@/lib/stores/terminal-store";
import { COMMANDS } from "../commands";
import type { Command } from "../types";

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

  const parseCommand = useCallback((input: string): { command: string; args: string[] } => {
    const trimmed = input.trim();
    if (!trimmed) {
      return { command: "", args: [] };
    }

    // Handle history recall: !! (repeat last), !<n> (by number), !<prefix> (by prefix)
    if (trimmed.startsWith("!")) {
      const rest = trimmed.slice(1);
      
      // !! - repeat last command
      if (rest === "!") {
        const lastCmd = commandHistory[commandHistory.length - 1];
        if (lastCmd) {
          return parseCommand(lastCmd);
        }
        return { command: "", args: [] };
      }

      // !<n> - by number
      const num = Number.parseInt(rest, 10);
      if (!Number.isNaN(num) && num > 0 && num <= commandHistory.length) {
        const historyIndex = commandHistory.length - num;
        const recalledCmd = commandHistory[historyIndex];
        if (recalledCmd) {
          return parseCommand(recalledCmd);
        }
      }

      // !<prefix> - by prefix (find last command starting with prefix)
      if (rest.length > 0) {
        for (let i = commandHistory.length - 1; i >= 0; i--) {
          const cmd = commandHistory[i];
          if (cmd && cmd.toLowerCase().startsWith(rest.toLowerCase())) {
            return parseCommand(cmd);
          }
        }
      }
    }

    const parts = trimmed.split(/\s+/);
    const command = parts[0]?.toLowerCase() ?? "";
    const args = parts.slice(1);

    return { command, args };
  }, [commandHistory]);

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
    (input: string, createErrorOutput: (input: string) => ReactNode) => {
      const { command: cmdName } = parseCommand(input);
      const command = executeCommand(input);
      
      if (command) {
        addCommand(command);
      } else {
        // Check if this was a clear command (which returns null intentionally)
        if (cmdName !== "clear" && cmdName !== "cls") {
          // Handle error case - create error message in component
          addCommand({ input, output: createErrorOutput(input) });
        }
        // If it was clear/cls, do nothing (screen already cleared)
      }
    },
    [addCommand, executeCommand, parseCommand]
  );

  const getAutocompleteMatches = useCallback((input: string) => {
    const { command } = parseCommand(input);
    if (!command) return [];
    
    return Object.entries(COMMANDS)
      .filter(([cmdName]) => cmdName.startsWith(command.toLowerCase()))
      .map(([cmdName, cmdDef]) => ({
        name: cmdName,
        description: cmdDef.descriptionKey 
          ? cmdDef.description 
          : cmdDef.description,
        fullCommand: cmdName,
      }));
  }, [parseCommand]);

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
                <div key={match.name} className="space-x-2">
                  <span className="text-cyan-600 dark:text-cyan-400">{match.name}</span>
                  <span className="text-muted-foreground text-xs">- {match.description}</span>
                </div>
              ))}
            </div>
          </div>
        );
        addCommand({ input: currentInput, output: matchesOutput });
        setTabPressedCount(0);
      }
    }
  }, [currentInput, setCurrentInput, parseCommand, tabPressedCount, addCommand, getAutocompleteMatches]);

  const getGhostText = useCallback(() => {
    const matches = getAutocompleteMatches(currentInput);
    if (matches.length === 1 && currentInput.trim()) {
      const { command } = parseCommand(currentInput);
      const rest = currentInput.slice(command.length).trim();
      return matches[0].fullCommand + (rest ? ` ${rest}` : "");
    }
    return "";
  }, [currentInput, parseCommand, getAutocompleteMatches]);

  const createHandleKeyDown = useCallback(
    (createErrorOutput: (input: string) => ReactNode) =>
      (e: KeyboardEvent<HTMLInputElement>) => {
        // Reset tab count on any other key
        if (e.key !== "Tab") {
          setTabPressedCount(0);
        }

        if (e.key === "Enter") {
          handleCommand(currentInput, createErrorOutput);
          setCurrentInput("");
          setTabPressedCount(0);
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
        } else if (e.ctrlKey || e.metaKey) {
          // Handle Ctrl/Cmd shortcuts
          if (e.key === "l" || e.key === "L") {
            e.preventDefault();
            clearCommands();
            setCurrentInput("");
          } else if (e.key === "u" || e.key === "U") {
            e.preventDefault();
            setCurrentInput("");
          } else if (e.key === "c" || e.key === "C") {
            e.preventDefault();
            addCommand({
              input: currentInput,
              output: <span className="text-muted-foreground">^C</span>,
            });
            setCurrentInput("");
          } else if (e.key === "k" || e.key === "K") {
            e.preventDefault();
            // Clear to end of line (just clear input for now)
            setCurrentInput("");
          }
        }
      },
    [currentInput, handleCommand, handleTab, navigateHistory, setCurrentInput, clearCommands, addCommand]
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
