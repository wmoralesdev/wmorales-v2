import { create } from "zustand";
import type { Command } from "@/components/landing/interactive-terminal/types";

type TerminalState = {
  // Command execution state
  commands: Command[];
  commandHistory: string[];
  historyIndex: number;
  currentInput: string;

  // Actions
  setCurrentInput: (input: string) => void;
  addCommand: (command: Command) => void;
  clearCommands: () => void;
  addToHistory: (input: string) => void;
  setHistoryIndex: (index: number) => void;
  resetHistoryIndex: () => void;
  navigateHistory: (direction: "up" | "down") => string | null;
};

const initialState = {
  commands: [],
  commandHistory: [],
  historyIndex: -1,
  currentInput: "",
};

export const useTerminalStore = create<TerminalState>((set, get) => ({
  ...initialState,

  setCurrentInput: (input) => set({ currentInput: input }),

  addCommand: (command) => {
    set((state) => ({
      commands: [...state.commands, command],
    }));
  },

  clearCommands: () => set({ commands: [] }),

  addToHistory: (input) => {
    set((state) => ({
      commandHistory: [...state.commandHistory, input],
      historyIndex: -1,
    }));
  },

  setHistoryIndex: (index) => set({ historyIndex: index }),

  resetHistoryIndex: () => set({ historyIndex: -1 }),

  navigateHistory: (direction) => {
    const { commandHistory, historyIndex } = get();
    const maxIndex = commandHistory.length - 1;

    if (direction === "up") {
      if (historyIndex < maxIndex) {
        const newIndex = historyIndex + 1;
        set({ historyIndex: newIndex });
        return commandHistory.at(-1 - newIndex) ?? null;
      }
    } else {
      // down
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        set({ historyIndex: newIndex });
        return commandHistory.at(-1 - newIndex) ?? null;
      }
      if (historyIndex === 0) {
        set({ historyIndex: -1, currentInput: "" });
        return "";
      }
    }
    return null;
  },
}));
