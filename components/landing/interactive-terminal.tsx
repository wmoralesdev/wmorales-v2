"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { COMMAND_SUGGESTIONS } from "./interactive-terminal/commands";
import { COMMANDS } from "./interactive-terminal/commands";
import { useTerminal } from "./interactive-terminal/hooks/use-terminal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import type { CommandCategory } from "./interactive-terminal/types";

const TYPING_DELAY_MS = 30;
const FOCUS_DELAY_MS = 100;

const COMMAND_CATEGORIES: Record<CommandCategory, string[]> = {
  system: ["clear", "history", "echo", "lang"],
  fun: ["banner", "cowsay", "matrix", "roll", "flip"],
  profile: ["socials", "resume", "whoami"],
  navigation: [],
};

export function InteractiveTerminal() {
  const t = useTranslations("terminal");
  const [isTyping, setIsTyping] = useState(true);
  const [typedText, setTypedText] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const {
    commands,
    currentInput,
    inputRef,
    setCurrentInput,
    createHandleKeyDown,
    createHandleSuggestionClick,
    focusInput,
    getGhostText,
  } = useTerminal();

  const ghostText = getGhostText();
  const ghostTextSuffix = ghostText && ghostText.length > currentInput.length
    ? ghostText.slice(currentInput.length)
    : "";

  const createErrorOutput = (input: string) => (
    <div className="text-red-600 dark:text-red-400">
      {t("notFound", { input })}
      <div className="mt-1 text-muted-foreground text-sm">
        {t("typeHelp")}
      </div>
    </div>
  );

  const handleKeyDown = createHandleKeyDown(createErrorOutput);
  const handleSuggestionClick = createHandleSuggestionClick(createErrorOutput);

  const welcomeMessage = t("welcome");

  // Typing effect for welcome message
  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < welcomeMessage.length) {
        setTypedText(welcomeMessage.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        // Focus input after welcome message
        setTimeout(() => focusInput(), FOCUS_DELAY_MS);
      }
    }, TYPING_DELAY_MS);

    return () => clearInterval(typingInterval);
  }, [focusInput, welcomeMessage]);

  // Auto-scroll to bottom when new commands are added
  // biome-ignore lint/correctness/useExhaustiveDependencies: commands is needed to trigger scroll
  useEffect(() => {
    if (terminalRef.current) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      });
    }
  }, [commands]);

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
    if (!isMinimized) {
      setIsExpanded(false);
    }
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setIsMinimized(false);
    }
  };

  const getTerminalHeight = () => {
    if (isMinimized) {
      return "auto";
    }
    if (isExpanded) {
      return "90vh";
    }
    return "500px";
  };

  const getExpandedMaxWidth = () => {
    if (isExpanded) {
      return "95vw";
    }
    return "100%";
  };

  return (
    <motion.div
      animate={{
        opacity: 1,
        y: 0,
        height: getTerminalHeight(),
        maxWidth: getExpandedMaxWidth(),
      }}
      className={`relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl backdrop-blur-sm ${
        isExpanded ? "mx-auto" : "w-full"
      }`}
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 border-border border-b px-4 py-3">
        <div className="flex gap-2">
          <div className="size-3 rounded-full bg-red-500" />
          <button
            className="h-3 w-3 cursor-pointer rounded-full bg-yellow-500 transition-all hover:bg-yellow-600 active:bg-yellow-700"
            onClick={handleMinimize}
            title={isMinimized ? "Restore" : "Minimize"}
            type="button"
          />
          <button
            className="h-3 w-3 cursor-pointer rounded-full bg-green-500 transition-all hover:bg-green-600 active:bg-green-700"
            onClick={handleExpand}
            title={isExpanded ? "Restore" : "Expand"}
            type="button"
          />
        </div>
        <div className="ml-4 text-muted-foreground text-sm">
          walter@portfolio ~ %
        </div>
      </div>

      {/* Terminal Content */}
      {isMinimized ? null : (
        <motion.div
          animate={{ opacity: 1 }}
          className="terminal-font min-h-0 flex-1 cursor-text overflow-y-auto p-4 text-sm"
          initial={{ height: 0, opacity: 0 }}
          onClick={focusInput}
          ref={terminalRef}
          transition={{ duration: 0.3 }}
        >
          {/* Welcome Message */}
          {isTyping ? (
            <div className="mb-4 whitespace-pre-line text-green-600 dark:text-green-400">
              {typedText}
              <span className="animate-pulse">▊</span>
            </div>
          ) : (
            <div className="mb-4 whitespace-pre-line text-green-600 dark:text-green-400">
              {welcomeMessage}
            </div>
          )}

          {/* Command History */}
          <AnimatePresence initial={false}>
            {commands.map((cmd, index) => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mb-3"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0, y: 10 }}
                key={`${cmd.input}-${index}`}
                transition={{ duration: 0.15 }}
              >
                {cmd.input && (
                  <div className="flex items-start">
                    <span className="mr-2 text-purple-600 dark:text-purple-400">
                      $
                    </span>
                    <span className="text-slate-900 dark:text-foreground">{cmd.input}</span>
                  </div>
                )}
                {cmd.output && (
                  <motion.div
                    animate={{ opacity: 1 }}
                    className="mt-1 ml-4"
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.15, delay: 0.05 }}
                  >
                    {typeof cmd.output === "string" ? (
                      <div className="text-muted-foreground">{cmd.output}</div>
                    ) : (
                      cmd.output
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Command Suggestions - Pinned + More menu */}
          {!isTyping && (
            <div className="mb-3 space-y-2">
              <div className="text-muted-foreground text-xs">
                Quick commands:
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {COMMAND_SUGGESTIONS.map((cmd) => (
                  <button
                    className="rounded border border-border bg-muted/50 px-3 py-1.5 text-cyan-600 text-xs transition-colors hover:border-cyan-500 hover:bg-muted focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:text-cyan-400"
                    key={cmd}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSuggestionClick(cmd);
                    }}
                    type="button"
                  >
                    {cmd}
                  </button>
                ))}
                <Popover open={showMoreMenu} onOpenChange={setShowMoreMenu}>
                  <PopoverTrigger asChild>
                    <Button
                      className="h-7 rounded border border-border bg-muted/50 px-3 text-cyan-600 text-xs transition-colors hover:border-cyan-500 hover:bg-muted focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:text-cyan-400"
                      size="sm"
                      variant="ghost"
                    >
                      More
                      <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-64 p-2">
                    <div className="space-y-2">
                      {(Object.entries(COMMAND_CATEGORIES) as Array<[CommandCategory, string[]]>).map(([category, cmds]) => {
                        if (cmds.length === 0) return null;
                        const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
                        return (
                          <div key={category}>
                            <div className="mb-1 text-xs font-semibold text-muted-foreground uppercase">
                              {categoryLabel}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {cmds.map((cmd) => {
                                const cmdDef = COMMANDS[cmd];
                                if (!cmdDef) return null;
                                return (
                                  <button
                                    className="rounded border border-border bg-muted/50 px-2 py-1 text-cyan-600 text-xs transition-colors hover:border-cyan-500 hover:bg-muted focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:text-cyan-400"
                                    key={cmd}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSuggestionClick(cmd);
                                      setShowMoreMenu(false);
                                    }}
                                    title={cmdDef.description}
                                    type="button"
                                  >
                                    {cmd}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Current Input Line */}
          {!isTyping && (
            <div className="relative flex items-center">
              <span className="mr-2 text-purple-600 dark:text-purple-400">
                $
              </span>
              <div className="relative flex-1">
                <input
                  autoComplete="off"
                  className="terminal-font relative z-10 w-full bg-transparent text-slate-900 placeholder-muted-foreground outline-none dark:text-foreground"
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter a command..."
                  ref={inputRef}
                  spellCheck={false}
                  type="text"
                  value={currentInput}
                />
                {ghostTextSuffix && (
                  <span className="pointer-events-none absolute left-0 top-0 z-0 text-muted-foreground opacity-50">
                    {currentInput}
                    <span className="text-slate-400 dark:text-slate-500">
                      {ghostTextSuffix}
                    </span>
                  </span>
                )}
              </div>
              <span className="animate-pulse text-muted-foreground">▊</span>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
