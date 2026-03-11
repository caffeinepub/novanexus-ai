import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SendHorizonal } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isLoading || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, isLoading, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-4 pb-4 pt-2">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={cn(
          "flex items-end gap-2 rounded-2xl border border-border bg-card px-4 py-3",
          "focus-within:border-primary/60 focus-within:shadow-gem transition-all",
        )}
      >
        <textarea
          data-ocid="chat.input"
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            adjustHeight();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask NovaNexus"
          rows={1}
          disabled={disabled || isLoading}
          className="flex-1 bg-transparent resize-none outline-none text-sm text-foreground placeholder:text-muted-foreground disabled:opacity-50 scrollbar-hide"
          style={{ minHeight: "24px" }}
        />
        <Button
          data-ocid="chat.send_button"
          onClick={handleSend}
          disabled={!value.trim() || isLoading || disabled}
          size="icon"
          className={cn(
            "flex-shrink-0 h-8 w-8 rounded-xl transition-all",
            value.trim() && !isLoading && !disabled
              ? "gem-gradient text-white shadow-gem hover:opacity-90"
              : "bg-muted text-muted-foreground",
          )}
        >
          <SendHorizonal className="h-4 w-4" />
        </Button>
      </motion.div>
      <p className="text-xs text-muted-foreground text-center mt-2">
        NovaNexus AI can make mistakes. Check important info.
      </p>
    </div>
  );
}
