"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { COMMAND_SUGGESTIONS } from "./interactive-terminal/commands";
import { useTerminal } from "./interactive-terminal/hooks/use-terminal";

const TYPING_DELAY_MS = 30;
const FOCUS_DELAY_MS = 100;

export function InteractiveTerminal() {
  const [isTyping, setIsTyping] = useState(true);
  const [typedText, setTypedText] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const {
    commands,
    currentInput,
    inputRef,
    setCurrentInput,
    createHandleKeyDown,
    createHandleSuggestionClick,
    focusInput,
  } = useTerminal();

  const createErrorOutput = (input: string) => (
    <div className="text-red-600 dark:text-red-400">
      Command not found: {input}
      <div className="mt-1 text-muted-foreground text-sm">
        Type 'help' for available commands
      </div>
    </div>
  );

  const handleKeyDown = createHandleKeyDown(createErrorOutput);
  const handleSuggestionClick = createHandleSuggestionClick(createErrorOutput);

  const welcomeMessage =
    "Welcome to my interactive terminal!\nType 'help' to see available commands.";

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
  }, [focusInput]);

  // Auto-scroll to bottom when new commands are added
  // biome-ignore lint/correctness/useExhaustiveDependencies: commands is needed to trigger scroll
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
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

  const getContentHeight = () => {
    if (isExpanded) {
      return "calc(90vh - 3rem)";
    }
    return "calc(500px - 3rem)";
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
      className={`relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl backdrop-blur-sm ${
        isExpanded ? "mx-auto" : "w-full"
      }`}
      initial={{ opacity: 0, y: 20 }}
      onClick={focusInput}
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
        <div className="ml-4 text-muted-foreground text-sm">walter@portfolio ~ %</div>
      </div>

      {/* Terminal Content */}
      {isMinimized ? null : (
        <motion.div
          animate={{ height: "auto", opacity: 1 }}
          className="overflow-y-auto p-4 text-sm"
          initial={{ height: 0, opacity: 0 }}
          ref={terminalRef}
          style={{
            fontFamily: "var(--mono-family)",
            height: getContentHeight(),
          }}
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
                    <span className="mr-2 text-purple-600 dark:text-purple-400">$</span>
                    <span className="text-foreground">{cmd.input}</span>
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

          {/* Command Suggestions - Always visible */}
          {!isTyping && (
            <div className="mb-3 space-y-2">
              <div className="text-muted-foreground text-xs">Quick commands:</div>
              <div className="flex flex-wrap gap-2">
                {COMMAND_SUGGESTIONS.map((cmd) => (
                  <button
                    className="rounded border border-border bg-muted/50 px-3 py-1.5 text-cyan-600 text-xs transition-colors hover:border-cyan-500 hover:bg-muted dark:text-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
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
              </div>
            </div>
          )}

          {/* Current Input Line */}
          {!isTyping && (
            <div className="flex items-center">
              <span className="mr-2 text-purple-600 dark:text-purple-400">$</span>
              <input
                autoComplete="off"
                className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none"
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter a command..."
                ref={inputRef}
                spellCheck={false}
                style={{ fontFamily: "var(--mono-family)" }}
                type="text"
                value={currentInput}
              />
              <span className="animate-pulse text-muted-foreground">▊</span>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
