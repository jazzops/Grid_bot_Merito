import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { generateRAGResponse } from "@/utils/ragUtils";
import { companiesData } from "@/data/companies";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  dataVisualizations?: Array<{
    type: "consumption" | "production" | "efficiency";
    title: string;
  }>;
}

const getDashboardValue = (query: string): { text: string; visualizations?: Message["dataVisualizations"] } => {
  const lowercaseQuery = query.toLowerCase();
  
  // Check for visualization requests
  if (lowercaseQuery.includes("zużycie") || lowercaseQuery.includes("zuzycie")) {
    return {
      text: "Oto wykres zużycia energii w czasie:",
      visualizations: [{ type: "consumption", title: "Zużycie energii" }]
    };
  }
  
  if (lowercaseQuery.includes("produkcja")) {
    return {
      text: "Oto wykres produkcji energii w czasie:",
      visualizations: [{ type: "production", title: "Produkcja energii" }]
    };
  }
  
  if (lowercaseQuery.includes("wydajność") || lowercaseQuery.includes("wydajnosc")) {
    return {
      text: "Oto wykres wydajności w czasie:",
      visualizations: [{ type: "efficiency", title: "Wydajność" }]
    };
  }

  const matchingStat = companiesData[0]?.stats.find(stat => {
    const title = stat.title.toLowerCase();
    return lowercaseQuery.includes(title);
  });

  if (matchingStat) {
    return {
      text: `${matchingStat.title}: ${matchingStat.value}${matchingStat.unit ? ' ' + matchingStat.unit : ''} (${matchingStat.description})`
    };
  }

  return { text: "Nie znalazłem tej informacji w panelu." };
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Witaj! Jestem twoim asystentem sieci energetycznej. Jak mogę Ci pomóc?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const clearConversation = () => {
    setMessages([
      {
        role: "assistant",
        content: "Witaj! Jestem twoim asystentem sieci energetycznej. Jak mogę Ci pomóc?",
        timestamp: new Date(),
      },
    ]);
    toast({
      title: "Konwersacja wyczyszczona",
      description: "Historia czatu została zresetowana.",
    });
  };

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (input: string) => {
      const dashboardValue = getDashboardValue(input);
      if (dashboardValue.text !== "Nie znalazłem tej informacji w panelu.") {
        return dashboardValue;
      }
      const response = await generateRAGResponse(input);
      return { text: response };
    },
    onSuccess: (response) => {
      const newMessage = {
        role: "assistant" as const,
        content: response.text,
        timestamp: new Date(),
        dataVisualizations: response.visualizations,
      };
      setMessages((prev) => [...prev, newMessage]);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response. Please try again.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: "user" as const,
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    sendMessage(input);
    setInput("");
  };

  return {
    messages,
    input,
    setInput,
    handleSubmit,
    isPending,
    clearConversation
  };
};