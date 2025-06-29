import { Metadata } from "next";
import { GuestbookContent } from "@/components/guestbook-content";

export const metadata: Metadata = {
  title: "Guestbook - Walter Morales",
  description: "Sign my digital guestbook and customize your unique ticket with AI.",
};

export default function GuestbookPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 animate-fade-in-up">
            <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              Guestbook
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground animate-fade-in-up animate-delay-200">
            Sign in and leave your mark with a personalized ticket
          </p>
        </div>

        <GuestbookContent />
      </div>
    </div>
  );
} 