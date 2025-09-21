
import { GoogleGenAI, Type } from "@google/genai";
// FIX: Corrected the import path for types.
import { Transaction, Budget, AIInsight } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this context, we assume the key is present.
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getFinancialInsights = async (transactions: Transaction[], budgets: Budget[]): Promise<AIInsight> => {
  const model = 'gemini-2.5-flash';
  
  const prompt = `
    Analyze the following business financial data and provide insights.
    The currency is in INR (₹).

    **Transactions:**
    ${JSON.stringify(transactions.slice(-20), null, 2)} 

    **Budgets:**
    ${JSON.stringify(budgets, null, 2)}

    Based on this data, provide a concise financial analysis.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallStatus: {
              type: Type.STRING,
              description: "A one-sentence summary of the business's financial health, mentioning if it's profitable, breaking even, or at a loss."
            },
            positiveHighlights: {
              type: Type.ARRAY,
              description: "2-3 bullet points highlighting positive financial activities or trends.",
              items: { type: Type.STRING }
            },
            areasForImprovement: {
              type: Type.ARRAY,
              description: "2-3 bullet points identifying the biggest expenses, budget overruns, or areas of concern.",
              items: { type: Type.STRING }
            },
            actionableTips: {
              type: Type.ARRAY,
              description: "Provide 2-3 specific, actionable recommendations to improve financial health, such as cost-cutting measures or revenue-boosting ideas.",
              items: { type: Type.STRING }
            }
          },
          required: ["overallStatus", "positiveHighlights", "areasForImprovement", "actionableTips"]
        }
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AIInsight;
  } catch (error) {
    console.error("Error fetching AI insights:", error);
    throw new Error("Failed to generate AI financial insights. Please check your API key and try again.");
  }
};
