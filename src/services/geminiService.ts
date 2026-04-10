/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY no encontrada. Por favor, configúrala en el panel de Secrets de AI Studio.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export interface Problem {
  enunciado: string;
  datos: number[];
  categoria: string;
  solucion: number;
  explicacion: string;
}

export async function generateAbnProblem(categoria: string, nivel: string): Promise<Problem> {
  const ai = getAI();

  const prompt = `
    Actúa como un experto en el método ABN (Abierto Basado en Números). 
    Genera un problema matemático para un alumno de ${nivel}.
    Categoría semántica: ${categoria}.
    
    Requisitos:
    1. El lenguaje debe ser motivador y adecuado a la edad.
    2. Los números deben ser coherentes con el nivel educativo.
    3. La estructura lógica debe seguir estrictamente la categoría ${categoria}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            enunciado: { type: Type.STRING },
            datos: { 
              type: Type.ARRAY,
              items: { type: Type.NUMBER }
            },
            categoria: { type: Type.STRING },
            solucion: { type: Type.NUMBER },
            explicacion: { type: Type.STRING }
          },
          required: ["enunciado", "datos", "categoria", "solucion", "explicacion"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as Problem;
  } catch (error) {
    console.error("Error generating problem:", error);
    throw error;
  }
}
