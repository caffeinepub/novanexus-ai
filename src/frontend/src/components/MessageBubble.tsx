import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { motion } from "motion/react";
import type { Message } from "../backend.d";
import { GemIcon } from "./GemIcon";

interface MessageBubbleProps {
  message: Message;
  index: number;
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.06, 0.3), duration: 0.35 }}
      className={cn(
        "flex gap-3 max-w-3xl",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto",
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "gem-gradient shadow-gem" : "bg-muted border border-border",
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <GemIcon size={18} />
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          "px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed",
          isUser
            ? "gem-gradient text-white rounded-tr-sm shadow-gem"
            : "bg-card border border-border text-card-foreground rounded-tl-sm",
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="flex gap-3 max-w-3xl mr-auto"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-muted border border-border">
        <GemIcon size={18} animated />
      </div>
      <div className="px-4 py-3.5 rounded-2xl rounded-tl-sm bg-card border border-border">
        <div className="flex gap-1.5 items-center h-4">
          <span className="typing-dot w-2 h-2 rounded-full bg-primary/60 block" />
          <span className="typing-dot w-2 h-2 rounded-full bg-primary/60 block" />
          <span className="typing-dot w-2 h-2 rounded-full bg-primary/60 block" />
        </div>
      </div>
    </motion.div>
  );
}
