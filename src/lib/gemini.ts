import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

if (!API_KEY) {
  console.error("Brak klucza API dla Gemini. Proszę dodać VITE_GOOGLE_API_KEY.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

export const generateGeminiResponse = async (prompt: string) => {
  if (!API_KEY) {
    return "Przepraszam, ale brak skonfigurowanego klucza API dla Gemini. Proszę skontaktować się z administratorem.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Błąd podczas komunikacji z Gemini:", error);
    return "Przepraszam, wystąpił błąd podczas przetwarzania zapytania. Proszę spróbować ponownie.";
  }
};

// Alias for backward compatibility
export const getGeminiResponse = generateGeminiResponse;