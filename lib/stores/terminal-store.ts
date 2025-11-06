import { create } from "zustand";
import type { Command } from "@/components/landing/interactive-terminal/types";

const STORAGE_KEY = "terminal-history";
const MAX_HISTORY_SIZE = 100;

type TerminalState = {
  // Command execution state
  commands: Command[];
  commandHistory: string[];
  historyIndex: number;
  currentInput: string;
  lastOutput: string | React.ReactNode | null;

  // Actions
  setCurrentInput: (input: string) => void;
  addCommand: (command: Command) => void;
  clearCommands: () => void;
  addToHistory: (input: string) => void;
  setHistoryIndex: (index: number) => void;
  resetHistoryIndex: () => void;
  navigateHistory: (direction: "up" | "down") => string | null;
  clearHistory: () => void;
  loadHistoryFromStorage: () => void;
};

const loadHistoryFromStorage = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as string[];
      return Array.isArray(parsed) ? parsed.slice(0, MAX_HISTORY_SIZE) : [];
    }
  } catch {
    // Ignore errors
  }
  return [];
};

const saveHistoryToStorage = (history: string[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_HISTORY_SIZE)));
  } catch {
    // Ignore errors
  }
};

const initialState = {
  commands: [],
  commandHistory: loadHistoryFromStorage(),
  historyIndex: -1,
  currentInput: "",
  lastOutput: null,
};

export const useTerminalStore = create<TerminalState>((set, get) => ({
  ...initialState,

  loadHistoryFromStorage: () => {
    const history = loadHistoryFromStorage();
    set({ commandHistory: history });
  },

  setCurrentInput: (input) => set({ currentInput: input }),

  addCommand: (command) => {
    set((state) => ({
      commands: [...state.commands, command],
      lastOutput: command.output,
    }));
  },

  clearCommands: () => set({ commands: [], lastOutput: null }),

  addToHistory: (input) => {
    const newHistory = [...get().commandHistory, input];
    saveHistoryToStorage(newHistory);
    set({
      commandHistory: newHistory,
      historyIndex: -1,
    });
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

  clearHistory: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    set({ commandHistory: [], historyIndex: -1 });
  },
}));
