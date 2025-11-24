import { GoogleGenAI } from "@google/genai";
import { Job } from "../types";

const ai = new GoogleGenAI({ apiKey:'AIzaSyCbr9WmX3VVGywNhoW0jDjSOqQpaRHxYrw' });

export const fetchJobsWithGemini = async (searchQuery: string = ""): Promise<Job[]> => {
  const modelId = "gemini-2.5-flash";
  
  // Construct a prompt that asks for real data via search, formatted as JSON.
  // We explicitly ask for a larger number of jobs and from multiple sources.
  const prompt = `
    I need to find a massive, comprehensive list of real, active, remote frontend developer job listings posted within the last 30 days worldwide.
    
    User Search Context: "${searchQuery}"
    
    Task:
    1. Use Google Search to find current job openings for "Remote Frontend Developer", "Remote React Engineer", "Remote Vue Developer", "Frontend Architect" across platforms like LinkedIn, WeWorkRemotely, RemoteOK, Glassdoor, Indeed, and company career pages.
    2. Select approximately 60 to 100 distinct, high-quality job listings. I need volume.
    3. Ensure a mix of regions (US, Europe, APAC, LATAM) that are marked as Remote.
    4. EXTRACT the data into a valid JSON array.
    
    Output Format:
    Return ONLY a JSON code block. The JSON should be an array of objects.
    Each object must have these fields:
    - id: string (unique identifier, can be random)
    - title: string (Job Title)
    - company: string (Company Name)
    - location: string (e.g., "Remote (Worldwide)", "Remote (US)", "Remote (EU)")
    - type: string (e.g., "Full-time", "Contract")
    - salary: string (e.g., "$120k - $160k", "€60k - €80k" or "Competitive" if not found)
    - tags: string[] (Tech stack keywords like "React", "TypeScript", "Next.js", "Tailwind")
    - description: string (A concise summary of the role, about 150-200 characters)
    - postedAt: string (e.g., "2 days ago", "Just now", "1 week ago")
    - applyLink: string (Direct URL to the job post if available, or company careers page)
    - experienceLevel: string (Infer from description: "Junior", "Mid", "Senior", "Lead")

    Ensure the JSON is valid. Do not include conversational text outside the JSON block.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    
    // Attempt to extract JSON from the response text
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsedData = JSON.parse(jsonMatch[1]);
        // Handle case where AI wraps it in an object like { "jobs": [...] }
        if (Array.isArray(parsedData)) {
          return parsedData;
        } else if (parsedData.jobs && Array.isArray(parsedData.jobs)) {
          return parsedData.jobs;
        }
        return [];
      } catch (e) {
        console.error("Failed to parse JSON from Gemini response", e);
        throw new Error("Failed to parse job data.");
      }
    } else {
       // Fallback: If no code block, try to parse the raw text if it looks like JSON
       try {
         const cleanText = text.trim();
         if (cleanText.startsWith('[') && cleanText.endsWith(']')) {
           return JSON.parse(cleanText);
         }
       } catch (e) {
         // ignore
       }
       console.warn("No JSON block found in response:", text);
       throw new Error("Could not retrieve structured job data.");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};