// API de Google Gemini
// Integración para generar descripciones con IA 

import { GoogleGenAI } from "@google/genai";
import type { Character } from '@/types/api';

class GeminiApiService {
  private client: GoogleGenAI | null = null;
  private apiKey: string | null = null;

  constructor() {
    // Obtener la API key del entorno
    this.apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || null;
    
    if (this.apiKey) {
      this.client = new GoogleGenAI({
        apiKey: this.apiKey
      });
    }
  }

  /**
   * Verificar si el servicio está configurado
   */
  isConfigured(): boolean {
    return !!this.client && !!this.apiKey;
  }

  /**
   * Generar descripción creativa de un personaje
   */
  async generateCharacterDescription(character: Character): Promise<string> {
    if (!this.isConfigured() || !this.client) {
      console.warn('Gemini API: No configurado, usando descripción de respaldo');
      return this.getFallbackDescription(character);
    }

    const prompt = this.buildCharacterPrompt(character);
    
    try {
      const response = await this.client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingBudget: 0, // Deshabilitar thinking para mayor velocidad
          },
        }
      });

      const generatedText = response.text;
      
      if (!generatedText || !generatedText.trim()) {
        console.warn('Gemini API: Respuesta vacía, usando descripción de respaldo');
        return this.getFallbackDescription(character);
      }

      return this.cleanResponse(generatedText);

    } catch (error) {
      console.warn('Gemini API: Error generando descripción, usando descripción de respaldo:', error);
      return this.getFallbackDescription(character);
    }
  }

  /**
   * Construir el prompt para el personaje
   */
  private buildCharacterPrompt(character: Character): string {
    const characterData = {
      nombre: character.name,
      id: character.id,
      estado: character.status,
      especie: character.species,
      tipo: character.type || 'Normal',
      genero: character.gender,
      origen: character.origin.name,
      ubicacion: character.location.name,
      episodios: character.episode.length
    };

    // Personajes principales de la familia Smith + Rick (IDs 1-5)
    const isMainCharacter = characterData.id >= 1 && characterData.id <= 5;

    return `
Eres un experto enciclopédico en la serie "Rick and Morty" con conocimiento detallado de todos los personajes, episodios, y tramas específicas de la serie.

PERSONAJE ESPECÍFICO A DESCRIBIR: ${characterData.nombre} (ID: ${characterData.id})

DATOS DEL PERSONAJE:
- Estado: ${characterData.estado}
- Especie: ${characterData.especie}
- Género: ${characterData.genero}
- Origen: ${characterData.origen}
- Ubicación actual: ${characterData.ubicacion}
- Apariciones: ${characterData.episodios} episodios

${isMainCharacter ? `
🌟 ¡PERSONAJE PRINCIPAL DE LA SERIE! (ID: ${characterData.id})
Este es uno de los 5 personajes principales de Rick and Morty. Debes incluir información MUY ESPECÍFICA y DETALLADA:

✨ CARACTERÍSTICAS PRINCIPALES OBLIGATORIAS A INCLUIR:
- Su personalidad distintiva y quirks únicos
- Su rol específico en la dinámica familiar Smith
- Sus miedos, inseguridades, y motivaciones principales
- Su evolución y desarrollo a lo largo de la serie
- Episodios icónicos donde es protagonista
- Sus frases características o momentos memorables
- Su relación específica con cada miembro de la familia
- Sus habilidades o talentos particulares

🎯 DETALLES ESPECÍFICOS SEGÚN EL PERSONAJE:
- Si es RICK SANCHEZ: Su genialidad, alcoholismo, nihilismo, inventos, relación con Morty, traumas del pasado
- Si es MORTY SMITH: Su ansiedad, crecimiento, valentía emergente, relación traumática con Rick
- Si es SUMMER SMITH: Su búsqueda de identidad, inteligencia subestimada, relación con sus padres
- Si es BETH SMITH: Su carrera, relación compleja con Rick, maternidad, dilemas existenciales
- Si es JERRY SMITH: Sus inseguridades, desempleo, relación con Beth, momentos de triunfo inesperados

📺 EPISODIOS Y MOMENTOS ESPECÍFICOS:
- Menciona al menos 1-2 episodios específicos donde este personaje brilla
- Incluye situaciones memorables que definen su carácter
- Referencias a arcos narrativos importantes del personaje

` : `
🎭 PERSONAJE SECUNDARIO/OCASIONAL
Usa tu conocimiento específico sobre "${characterData.nombre}" para crear una descripción personalizada:
`}

✨ INCLUYE INFORMACIÓN ESPECÍFICA DEL PERSONAJE como:
- Su personalidad, quirks y características únicas
- Episodios específicos donde aparece y qué hace en ellos
- Su relación específica con Rick, Morty, u otros personajes principales
- Momentos memorables, frases icónicas, o acciones características
- Su rol específico en las tramas donde aparece
- Habilidades especiales, trabajo, o función particular
- Backstory o historia personal si es relevante

📺 ENFOQUE NARRATIVO:
- Escribe como si fueras un fan experto explicando por qué este personaje es fascinante
- Usa detalles específicos que solo un verdadero fan de la serie conocería
- Menciona aspectos únicos que hacen memorable a este personaje
- ${isMainCharacter ? 'Para personajes principales: sé MUY detallado y específico' : 'Si no reconoces al personaje específico, enfócate en su especie/origen pero mantén el tono personal'}

🎭 ESTILO DE ESCRITURA:
- ${isMainCharacter ? '3-4 líneas MUY específicas y detalladas' : '3-4 líneas conversacionales e informativas'}
- Tono entusiasta pero informativo, como un fan compartiendo trivia
- Incluye humor sutil cuando sea apropiado para el personaje
- En español, fluido y natural
- Cada línea entre 70-120 caracteres
- MÁXIMO 4 líneas para que sea conciso y fácil de leer

IMPORTANTE: ${isMainCharacter ? `Este es un PERSONAJE PRINCIPAL - usa TU conocimiento específico sobre ${characterData.nombre}. Incluye detalles profundos pero CONCISO, máximo 4 líneas.` : `Si reconoces a "${characterData.nombre}" como un personaje específico de Rick and Morty, usa ESE conocimiento específico. Máximo 4 líneas, conciso pero informativo.`}

Responde ÚNICAMENTE con el párrafo descriptivo personalizado.
    `.trim();
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
      .replace(/🚀|🌀|🎭|🔬|⚡|🌌|💫/g, '') // Remover emojis que puedan filtrarse
      .split('\n')
      .filter(line => line.trim()) // Remover líneas vacías
      .slice(0, 4) // Tomar hasta 4 líneas máximo
      .join('\n');
  }

  /**
   * Descripción de fallback mejorada
   */
  private getFallbackDescription(character: Character): string {
    // Fallbacks súper específicos para personajes principales (IDs 1-5) - VERSIÓN CONCISA
    const mainCharacterDescriptions: { [key: number]: string } = {
      1: `Rick Sanchez es el genio científico más brillante del multiverso, un alcohólico nihilista de 70 años cuya inteligencia rivaliza con su desprecio hacia la existencia. Este abuelo sociopática arrastra a Morty a aventuras interdimensionales mientras bebe de su petaca y eructa compulsivamente. Su pistola portal le permite viajar entre dimensiones infinitas, pero su verdadera arma es su sarcasmo y capacidad de manipulación. Episodios como "Pickle Rick" muestran sus extremos para evitar terapia familiar, mientras que "The Rickshank Rickdemption" revela sus traumas profundos y sacrificios ocultos por su familia.`,
      
      2: `Morty Smith es un adolescente de 14 años lleno de ansiedad que sirve como brújula moral de Rick, constantemente traumatizado por aventuras interdimensionales. Inicialmente cobarde y tartamudo, Morty ha evolucionado mostrando valentía inesperada y resistencia creciente a la manipulación de Rick. Su crush eterno por Jessica contrasta con las situaciones cósmicamente aterradoras que enfrenta diariamente. Episodios como "Rest and Ricklaxation" exploran su toxicidad interna, mientras que "The Vat of Acid Episode" muestra su resentimiento hacia Rick y capacidad de venganza planificada.`,
      
      3: `Summer Smith, de 17 años, inicialmente parecía una adolescente típica obsesionada con popularidad, pero ha demostrado ser más inteligente y capaz de lo aparente. Su búsqueda de aprobación parental se complica por su relación con Rick, quien paradójicamente la respeta más que Jerry. Summer puede ser cruel y calculadora cuando protege a su familia. Episodios como "The Whirly Dirly Conspiracy" muestran su lealtad feroz hacia Jerry, mientras que "Rickmancing the Stone" revela su lado salvaje cuando escapa de problemas familiares.`,
      
      4: `Beth Smith es veterinaria especializada en cirugía equina que lucha entre ser madre responsable y seguir los pasos aventureros de Rick. Su inteligencia heredada la convierte en madre impredecible, tanto amorosa como peligrosamente negligente. Beth vive atormentada por el abandono paterno y la pregunta constante de si es un clon o la Beth "real". Episodios como "The ABC's of Beth" exploran su lado sádico, mientras su relación tóxica con Jerry define su arco narrativo y decisiones autodestructivas.`,
      
      5: `Jerry Smith es el padre inseguro y perpetuamente desempleado que representa todo lo que Rick desprecia: mediocridad, conformismo y necesidad de validación. A pesar de ser constantemente humillado por Rick y subestimado por su familia, Jerry ocasionalmente tiene momentos de triunfo que revelan astucia oculta. Su trabajo intermitente en publicidad y crisis existenciales lo convierten en comic relief, pero también en corazón emocional familiar. Episodios como "Mortynight Run" muestran su capacidad manipulativa y "Interdimensional Cable 2" revela su amor profundo por la familia.`
    };

    // Si es un personaje principal, usar descripción específica
    if (mainCharacterDescriptions[character.id]) {
      return mainCharacterDescriptions[character.id];
    }

    // Para personajes secundarios, usar el sistema anterior mejorado
    const especies: { [key: string]: string } = {
      'Human': 'humano del multiverso Rick & Morty',
      'Alien': 'alienígena de las infinitas dimensiones',
      'Robot': 'androide con inteligencia artificial avanzada',
      'Animal': 'criatura con características evolutivas únicas',
      'Humanoid': 'ser humanoide de origen interdimensional',
      'Cronenberg': 'abominación resultado de experimentos genéticos fallidos',
      'Mythological Creature': 'entidad mítica que desafía la lógica científica'
    };

    const estados: { [key: string]: string } = {
      'Alive': 'activo en las aventuras multiversales',
      'Dead': 'víctima del caos interdimensional',
      'unknown': 'de paradero incierto en el vasto multiverso'
    };

    const especie = especies[character.species] || `ser de la especie ${character.species}`;
    const estado = estados[character.status] || 'en estado desconocido';
    const episodios = character.episode.length;

    if (episodios > 15) {
      return `${character.name} es un ${especie} que ha sido ${estado} a lo largo de ${episodios} episodios de Rick and Morty. Su presencia recurrente sugiere un rol importante en las aventuras interdimensionales. Originario de ${character.origin.name}, ha demostrado ser significativo en múltiples tramas de la serie. Su ubicación actual en ${character.location.name} lo mantiene conectado al complejo entramado narrativo del show.`;
    } else if (episodios >= 5) {
      return `${character.name} es un ${especie} que aparece en ${episodios} episodios de Rick and Morty, manteniéndose ${estado} en el proceso. Aunque no es personaje principal, su presencia intermitente lo convierte en figura reconocible del universo Rick & Morty. Su origen en ${character.origin.name} y estancia en ${character.location.name} lo posicionan como parte integral del extenso catálogo de personajes de la serie.`;
    } else {
      return `${character.name} es un ${especie} que hace apariciones esporádicas en Rick and Morty, actualmente ${estado} según registros interdimensionales. A pesar de aparecer en solo ${episodios} episodio${episodios === 1 ? '' : 's'}, forma parte del rico tapiz de personajes del multiverso. Proveniente de ${character.origin.name} y localizado en ${character.location.name}, representa la diversidad infinita de seres que Rick y Morty encuentran.`;
    }
  }

  /**
   * Obtener mensaje de configuración para mostrar al usuario
   */
  getConfigurationMessage(): string {
    return `
Para usar la funcionalidad de IA, necesitas configurar tu API key de Google Gemini:

1. Visita https://ai.google.dev/ y obtén tu API key
2. Crea un archivo .env.local en la raíz del proyecto
3. Agrega: NEXT_PUBLIC_GEMINI_API_KEY=tu_api_key_aquí
4. Reinicia el servidor de desarrollo

Mientras tanto, se mostrará una descripción básica generada automáticamente.
    `.trim();
  }
}

// Exportar instancia singleton
export const geminiApi = new GeminiApiService();
export default geminiApi; 