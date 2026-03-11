import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Menu } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ChatInput } from "./components/ChatInput";
import { ConversationView } from "./components/ConversationView";
import { GemIcon } from "./components/GemIcon";
import { Sidebar } from "./components/Sidebar";
import { ThemeToggle } from "./components/ThemeToggle";
import { WelcomeScreen } from "./components/WelcomeScreen";

import {
  useCreateConversation,
  useDeleteConversation,
  useGetMessages,
  useGetUserProfile,
  useListConversations,
  useSendMessage,
} from "./hooks/useQueries";

const queryClient = new QueryClient();

function AppContent() {
  const [activeConversationId, setActiveConversationId] = useState<
    bigint | null
  >(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const { data: conversations = [], isLoading: convLoading } =
    useListConversations();
  const { data: messages = [], isLoading: msgLoading } =
    useGetMessages(activeConversationId);
  const { data: userProfile } = useGetUserProfile();

  const createConversation = useCreateConversation();
  const deleteConversation = useDeleteConversation();
  const sendMessage = useSendMessage();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNewChat = useCallback(() => {
    setActiveConversationId(null);
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, []);

  const handleSelectConversation = useCallback((id: bigint) => {
    setActiveConversationId(id);
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, []);

  const handleDeleteConversation = useCallback(
    async (id: bigint) => {
      try {
        await deleteConversation.mutateAsync(id);
        if (activeConversationId === id) {
          setActiveConversationId(null);
        }
        toast.success("Conversation deleted");
      } catch {
        toast.error("Failed to delete conversation");
      }
    },
    [deleteConversation, activeConversationId],
  );

  const handleSendMessage = useCallback(
    async (content: string) => {
      let convId = activeConversationId;

      if (convId === null) {
        try {
          const title =
            content.length > 40 ? `${content.slice(0, 40)}...` : content;
          convId = await createConversation.mutateAsync(title);
          setActiveConversationId(convId);
        } catch {
          toast.error("Failed to create conversation");
          return;
        }
      }

      const activeConvId: bigint = convId;
      setIsTyping(true);
      try {
        await sendMessage.mutateAsync({
          conversationId: activeConvId,
          content,
        });
      } catch {
        toast.error("Failed to send message");
      } finally {
        setIsTyping(false);
      }
    },
    [activeConversationId, createConversation, sendMessage],
  );

  const handlePromptClick = useCallback(
    (prompt: string) => {
      handleSendMessage(prompt);
    },
    [handleSendMessage],
  );

  const userName = userProfile?.name || "there";
  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId,
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        conversations={conversations}
        isLoading={convLoading}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              data-ocid="header.sidebar.toggle"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground rounded-xl"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="Toggle sidebar"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <AnimatePresence mode="wait">
              {activeConversation ? (
                <motion.div
                  key="title"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-sm font-medium text-foreground truncate max-w-xs">
                    {activeConversation.title}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="logo"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="flex items-center gap-2"
                >
                  <GemIcon size={20} />
                  <span className="text-sm font-bricolage font-semibold gem-text-gradient">
                    NovaNexus AI
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <ThemeToggle />
        </header>

        <div className="flex-1 flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            {activeConversationId === null ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col"
              >
                <WelcomeScreen
                  userName={userName}
                  onPromptClick={handlePromptClick}
                />
              </motion.div>
            ) : (
              <motion.div
                key={`conv-${activeConversationId}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col min-h-0"
              >
                <ConversationView
                  messages={messages}
                  isLoading={msgLoading}
                  isTyping={isTyping}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className={cn(
              "flex-shrink-0",
              activeConversationId === null ? "max-w-2xl w-full mx-auto" : "",
            )}
          >
            <ChatInput
              onSend={handleSendMessage}
              isLoading={
                isTyping ||
                sendMessage.isPending ||
                createConversation.isPending
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
