import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence } from "motion/react";
import { useEffect, useRef } from "react";
import type { Message } from "../backend.d";
import { MessageBubble, TypingIndicator } from "./MessageBubble";

interface ConversationViewProps {
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
}

export function ConversationView({
  messages,
  isLoading,
  isTyping,
}: ConversationViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  if (isLoading) {
    return (
      <div
        data-ocid="conversation.loading_state"
        className="flex-1 p-6 space-y-4"
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex gap-3 ${i % 2 === 0 ? "justify-end" : ""}`}
          >
            {i % 2 !== 0 && (
              <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
            )}
            <Skeleton className="h-16 w-64 rounded-2xl" />
            {i % 2 === 0 && (
              <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="px-4 md:px-8 py-6 space-y-4 max-w-4xl mx-auto">
        {messages.map((message, idx) => (
          <MessageBubble
            key={`msg-${message.role}-${String(message.timestamp)}-${idx}`}
            message={message}
            index={idx}
          />
        ))}
        <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
