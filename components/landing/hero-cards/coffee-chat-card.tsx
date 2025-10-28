"use client";

import { motion } from "framer-motion";
import { Coffee } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { BaseCard, type BaseCardProps } from "./base-card";

// Type definitions for Google Calendar API
declare global {
  type Window = {
    calendar?: {
      schedulingButton: {
        load: (options: {
          url: string;
          color: string;
          label: string;
          target: HTMLElement;
        }) => void;
      };
    };
  };
}

type CoffeeChatCardProps = Omit<BaseCardProps, "children" | "id"> & {
  onChatClick?: () => void;
};

export function CoffeeChatCard({ onChatClick, ...props }: CoffeeChatCardProps) {
  const t = useTranslations("homepage.cards");
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [buttonInitialized, setButtonInitialized] = useState(false);

  useEffect(() => {
    // Load the Google Calendar script
    const script = document.createElement("script");
    script.src =
      "https://calendar.google.com/calendar/scheduling-button-script.js";
    script.async = true;

    script.onload = () => {
      setScriptLoaded(true);

      // Initialize the button after script loads
      if (scriptRef.current && window.calendar?.schedulingButton) {
        try {
          window.calendar.schedulingButton.load({
            url: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3le7owokGKyKwsSTL9NavJ_kVj19-XBgqzGbwLcx5Q8qmSQNOK-C0rYCpJqDumc8mHycf9P-lg?gv=true",
            color: "#fff",
            label: t("chat"),
            target: scriptRef.current,
          });
          setButtonInitialized(true);
        } catch (error) {
          console.error("Failed to initialize Google Calendar button:", error);
        }
      }
    };

    script.onerror = () => {
      console.error("Failed to load Google Calendar script");
      setScriptLoaded(true); // Set as loaded to show fallback
    };

    // Insert the script where we want the button to appear
    if (scriptRef.current) {
      scriptRef.current.parentNode?.insertBefore(
        script,
        scriptRef.current.nextSibling
      );
    }

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [t]);

  const handleFallbackClick = () => {
    window.open(
      "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2aY5aDah-QjutEWgNBdEFvpZhAkTLmZu3zJoOuwLgLNya648cpJaK6BE1NzVMVQHp9Mb0XuGxl?gv=true",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <BaseCard
      className="border-purple-700/50 bg-gradient-to-r from-purple-900/30 to-purple-800/30 p-4 backdrop-blur-xl"
      id="coffee-chat"
      {...props}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Coffee className="h-6 w-6 text-purple-400" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-sm text-white">
              {t("coffeeChat")}
            </h3>
            <p className="text-gray-400 text-xs">
              {t("bestIdeasStartWithAConversation")}
            </p>
          </div>
        </div>

        {/* Google Calendar Button Container */}
        <div className="google-calendar-button-container inline-flex">
          {/* Fallback button shown while loading or if script fails */}
          {!buttonInitialized && scriptLoaded && (
            <Button
              className="border-purple-500/50 text-purple-300 text-xs hover:bg-purple-500/20"
              onClick={handleFallbackClick}
              size="sm"
              variant="outline"
            >
              {t("chat")}
            </Button>
          )}

          {/* Loading state */}
          {!scriptLoaded && (
            <Button
              className="border-purple-500/50 text-purple-300 text-xs opacity-50"
              disabled
              size="sm"
              variant="outline"
            >
              {t("chat")}
            </Button>
          )}

          {/* This script ref is used as the target for the Google Calendar button */}
          <script ref={scriptRef} type="text/javascript" />
        </div>
      </div>
    </BaseCard>
  );
}
