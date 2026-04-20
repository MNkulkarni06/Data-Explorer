import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini AI with the API key from environment
const genAI = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || '' 
});

/**
 * Service to handle data analysis using Gemini AI
 */
export async function analyzeDataset(datasetName: string, dataSample: any[]) {
  try {
    // Prepare a concise summary of the data for the model
    const dataString = JSON.stringify(dataSample.slice(0, 10)); // Top 10 rows for context
    const prompt = `
      As a senior data scientist, analyze the following dataset: "${datasetName}".
      
      Data sample:
      ${dataString}
      
      Please provide:
      1. A high-level summary of the data's purpose.
      2. 3 key insights or trends you can infer.
      3. A recommendation for further detailed analysis.
      
      Format the response with clear headings and bullet points using markdown.
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("Failed to generate AI insights. Please ensure the Gemini API key is configured.");
  }
}
