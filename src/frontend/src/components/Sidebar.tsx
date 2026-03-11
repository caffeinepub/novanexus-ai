import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { MessageSquare, Plus, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Conversation } from "../backend.d";
import { GemIcon } from "./GemIcon";

interface SidebarProps {
  conversations: Conversation[];
  isLoading: boolean;
  activeConversationId: bigint | null;
  onSelectConversation: (id: bigint) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: bigint) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  conversations,
  isLoading,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  isOpen,
  onClose,
}: SidebarProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<bigint | null>(null);

  const sortedConversations = [...conversations].sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp),
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : "-100%",
          opacity: isOpen ? 1 : 0.8,
        }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className={cn(
          "fixed left-0 top-0 h-full w-72 z-50 md:z-auto",
          "md:relative md:translate-x-0 md:opacity-100",
          "flex flex-col bg-sidebar border-r border-sidebar-border",
        )}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <GemIcon size={28} />
            <span className="font-bricolage font-bold text-lg text-sidebar-foreground">
              NovaNexus AI
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-3 pb-3">
          <Button
            data-ocid="sidebar.new_chat.button"
            onClick={onNewChat}
            className="w-full gap-2 gem-gradient new-chat-btn text-white border-0 shadow-gem"
          >
            <Plus className="h-4 w-4" />
            New chat
          </Button>
        </div>

        <div className="px-4 pb-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Recent
          </p>
        </div>

        <ScrollArea className="flex-1 px-2">
          {isLoading ? (
            <div className="space-y-1 px-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : sortedConversations.length === 0 ? (
            <div
              data-ocid="sidebar.conversations.empty_state"
              className="px-4 py-8 text-center"
            >
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No conversations yet
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {sortedConversations.map((conv, idx) => (
                <motion.div
                  key={conv.id.toString()}
                  data-ocid={`sidebar.conversation.item.${idx + 1}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className={cn(
                    "group flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer transition-colors",
                    activeConversationId === conv.id
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/60 text-sidebar-foreground",
                  )}
                  onClick={() => onSelectConversation(conv.id)}
                >
                  <MessageSquare className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                  <span className="flex-1 text-sm truncate">{conv.title}</span>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        type="button"
                        data-ocid={`sidebar.conversation.delete_button.${idx + 1}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTargetId(conv.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:text-destructive"
                        aria-label="Delete conversation"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete conversation?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete &quot;{conv.title}&quot;
                          and all its messages.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel data-ocid="sidebar.delete.cancel_button">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          data-ocid="sidebar.delete.confirm_button"
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => {
                            if (deleteTargetId !== null) {
                              onDeleteConversation(deleteTargetId);
                            }
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()}{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </motion.aside>
    </>
  );
}
