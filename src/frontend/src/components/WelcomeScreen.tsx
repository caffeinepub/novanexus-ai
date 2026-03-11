import { Globe, Lightbulb, PlaneTakeoff, Utensils } from "lucide-react";
import { motion } from "motion/react";
import { GemIcon } from "./GemIcon";

const SUGGESTED_PROMPTS = [
  {
    id: "quantum",
    icon: <Lightbulb className="h-5 w-5" />,
    title: "Explain quantum computing",
    subtitle: "in simple terms",
  },
  {
    id: "poem",
    icon: <Globe className="h-5 w-5" />,
    title: "Write a poem about the ocean",
    subtitle: "something beautiful and vivid",
  },
  {
    id: "japan",
    icon: <PlaneTakeoff className="h-5 w-5" />,
    title: "Help me plan a trip to Japan",
    subtitle: "7-day itinerary",
  },
  {
    id: "breakfast",
    icon: <Utensils className="h-5 w-5" />,
    title: "Healthy breakfast ideas",
    subtitle: "quick and nutritious",
  },
];

interface WelcomeScreenProps {
  userName: string;
  onPromptClick: (prompt: string) => void;
}

export function WelcomeScreen({ userName, onPromptClick }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="flex justify-center mb-4">
          <GemIcon size={48} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bricolage font-bold mb-2">
          <span className="text-foreground">Hello, </span>
          <span className="gem-text-gradient">{userName}</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          How can I help you today?
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl"
      >
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <motion.button
            key={prompt.id}
            type="button"
            data-ocid={`welcome.prompt.item.${idx + 1}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.08 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPromptClick(prompt.title)}
            className="group flex items-start gap-3 p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-gem transition-all text-left"
          >
            <div className="p-2 rounded-xl gem-gradient text-white flex-shrink-0 shadow-sm">
              {prompt.icon}
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">
                {prompt.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {prompt.subtitle}
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
