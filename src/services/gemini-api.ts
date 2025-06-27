// API de Google Gemini
// Integración para generar descripciones con IA 

// Servicio API de Google Gemini para IA
import { ERROR_MESSAGES } from '@/lib/constants';
import type { Character } from '@/types/api';

// Configuración de Gemini
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

class GeminiApiService {
  private apiKey: string | null = null;

  constructor() {
    // Obtener la API key del entorno
    this.apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || null;
  }

  /**
   * Verificar si el servicio está configurado
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Generar descripción creativa de un personaje
   */
  async generateCharacterDescription(character: Character): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('API key de Gemini no configurada');
    }

    const prompt = this.buildCharacterPrompt(character);
    
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.buildGeminiRequest(prompt)),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No se recibió respuesta de la IA');
      }

      const generatedText = data.candidates[0]?.content?.parts[0]?.text;
      
      if (!generatedText) {
        throw new Error('Respuesta vacía de la IA');
      }

      return this.cleanResponse(generatedText);

    } catch (error) {
      console.error('Error generando descripción:', error);
      
      if (error instanceof Error) {
        throw new Error(`${ERROR_MESSAGES.AI_ERROR} ${error.message}`);
      }
      
      throw new Error(ERROR_MESSAGES.AI_ERROR);
    }
  }

  /**
   * Construir el prompt para el personaje
   */
  private buildCharacterPrompt(character: Character): string {
    const characterData = {
      nombre: character.name,
      estado: character.status,
      especie: character.species,
      tipo: character.type || 'Normal',
      genero: character.gender,
      origen: character.origin.name,
      ubicacion: character.location.name,
      episodios: character.episode.length
    };

    return `
Como experto en ciencia ficción y la serie Rick and Morty, escribe un párrafo creativo y atractivo de exactamente 3 líneas describiendo al siguiente personaje:

Datos del personaje:
${JSON.stringify(characterData, null, 2)}

Instrucciones:
- Escribe exactamente 3 líneas (no más, no menos)
- Usa un tono creativo y entusiasta apropiado para fans de ciencia ficción
- Incorpora elementos únicos del universo de Rick and Morty
- Menciona aspectos interesantes de su estado, especie y origen
- Haz referencia a su participación en ${characterData.episodios} episodios
- Escribe en español
- No uses asteriscos ni marcadores especiales
- Mantén cada línea entre 80-120 caracteres

Responde únicamente con el párrafo de 3 líneas, sin introducción ni comentarios adicionales.
    `.trim();
  }

  /**
   * Construir request para Gemini API
   */
  private buildGeminiRequest(prompt: string): GeminiRequest {
    return {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };
  }

  /**
   * Limpiar y formatear la respuesta
   */
  private cleanResponse(text: string): string {
    return text
      .trim()
      .replace(/\*\*/g, '') // Remover asteriscos de bold
      .replace(/\*/g, '')   // Remover asteriscos simples
      .replace(/#{1,6}\s/g, '') // Remover headers markdown
      .replace(/^\s*[-*]\s/gm, '') // Remover bullets
      .split('\n')
      .filter(line => line.trim()) // Remover líneas vacías
      .slice(0, 3) // Tomar solo las primeras 3 líneas
      .join('\n');
  }

  /**
   * Generar descripción de respaldo si falla la IA
   */
  generateFallbackDescription(character: Character): string {
    const status = character.status === 'Alive' ? 'vivo' : 
                  character.status === 'Dead' ? 'muerto' : 'de estado desconocido';
    
    const species = character.species.toLowerCase();
    const origin = character.origin.name;
    const episodes = character.episode.length;

    return `${character.name} es un ${species} ${status} originario de ${origin}.
Este fascinante personaje ha aparecido en ${episodes} episodios de la serie.
Su historia forma parte del complejo multiverso de Rick and Morty.`;
  }
}

// Exportar instancia singleton
export const geminiApi = new GeminiApiService();
export default geminiApi; 