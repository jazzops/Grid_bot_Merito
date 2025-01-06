import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Bot, User } from "lucide-react";
import { ChatEnergyData } from "./ChatEnergyData";
import { motion } from "framer-motion";

interface ChatMessageProps {
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
  dataVisualizations?: Array<{
    type: "consumption" | "production" | "efficiency";
    title: string;
  }>;
}

export function ChatMessage({ role, content, timestamp, dataVisualizations }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${role === "assistant" ? "flex-row" : "flex-row-reverse"}`}>
      <Avatar className="h-8 w-8 md:h-10 md:w-10 shrink-0">
        {role === "assistant" ? (
          <>
            <AvatarImage src="/lovable-uploads/045f69f0-5424-4c58-a887-6e9e984d428b.png" />
            <AvatarFallback><Bot className="h-4 w-4 md:h-5 md:w-5" /></AvatarFallback>
          </>
        ) : (
          <>
            <AvatarFallback><User className="h-4 w-4 md:h-5 md:w-5" /></AvatarFallback>
          </>
        )}
      </Avatar>
      <div className={`flex flex-col gap-2 max-w-[85%] md:max-w-[75%] ${role === "assistant" ? "items-start" : "items-end"}`}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className={`rounded-2xl px-4 py-2.5 ${
            role === "assistant"
              ? "bg-card text-card-foreground shadow-sm"
              : "bg-primary text-primary-foreground"
          }`}
        >
          <p className="text-sm md:text-base whitespace-pre-wrap">{content}</p>
          {dataVisualizations?.map((viz, index) => (
            <ChatEnergyData key={index} dataType={viz.type} title={viz.title} />
          ))}
        </motion.div>
        <span className="text-xs text-muted-foreground px-1">
          {format(timestamp, "HH:mm")}
        </span>
      </div>
    </div>
  );
}