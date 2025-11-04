import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { extractText } from "../utils/extract-text";
import { useTypingAnimation } from "../hooks/use-typing-animation";

type TypingOutputProps = {
  content: string | ReactNode;
  onComplete?: () => void;
};

export function TypingOutput({ content, onComplete }: TypingOutputProps) {
  const isString = typeof content === "string";
  const [showFullContent, setShowFullContent] = useState(false);
  
  // Extract text from ReactNode for typing animation (memoized to prevent re-extraction)
  const textToType = useMemo(
    () => (isString ? content : extractText(content)),
    [content, isString],
  );
  const { displayedText, isTyping } = useTypingAnimation(textToType, true);

  // Call onComplete when typing finishes
  const prevIsTypingRef = useRef(isTyping);
  useEffect(() => {
    if (prevIsTypingRef.current && !isTyping && !showFullContent) {
      // When typing finishes, show the full content
      setShowFullContent(true);
      if (onComplete) {
        onComplete();
      }
    }
    prevIsTypingRef.current = isTyping;
  }, [isTyping, showFullContent, onComplete]);

  if (isString) {
    return (
      <>
        {displayedText}
        {isTyping && <span className="animate-pulse">▊</span>}
      </>
    );
  }

  // For ReactNode: type the text first, then reveal the structured content
  if (!showFullContent) {
    // Show typing text while extracting and typing
    return (
      <>
        {displayedText}
        {isTyping && <span className="animate-pulse">▊</span>}
      </>
    );
  }

  // After typing, fade in the actual ReactNode structure
  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {content}
    </motion.div>
  );
}

