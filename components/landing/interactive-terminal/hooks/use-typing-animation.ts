import { useEffect, useState } from "react";

const TYPING_DELAY_MS = 15;

export function useTypingAnimation(
  text: string,
  enabled = true,
  delay = TYPING_DELAY_MS
): { displayedText: string; isTyping: boolean } {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    setDisplayedText("");
    setIsTyping(true);
    let index = 0;

    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, delay);

    return () => {
      clearInterval(typingInterval);
    };
  }, [text, enabled, delay]);

  return { displayedText, isTyping };
}
