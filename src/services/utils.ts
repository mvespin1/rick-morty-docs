// Utilidades para servicios
// Helpers para formateo y validación 

// Utilidades para servicios de API
import { extractIdFromUrl, isValidCharacterId } from '@/lib/utils';
import type { Character } from '@/types/api';

/**
 * Extraer IDs de episodios de un personaje
 */
export function extractEpisodeIds(character: Character): number[] {
  return character.episode
    .map(episodeUrl => extractIdFromUrl(episodeUrl))
    .filter((id): id is number => id !== null && id > 0);
}

/**
 * Extraer ID de ubicación de un personaje
 */
export function extractLocationId(locationUrl: string): number | null {
  if (!locationUrl || locationUrl === '') return null;
  return extractIdFromUrl(locationUrl);
}

/**
 * Validar datos de personaje recibidos de la API
 */
export function validateCharacterData(data: unknown): data is Character {
  if (typeof data !== 'object' || data === null) return false;
  
  const obj = data as Record<string, unknown>;
  
  return (
    typeof obj.id === 'number' &&
    isValidCharacterId(obj.id) &&
    typeof obj.name === 'string' &&
    obj.name.length > 0 &&
    typeof obj.status === 'string' &&
    ['Alive', 'Dead', 'unknown'].includes(obj.status) &&
    typeof obj.species === 'string' &&
    typeof obj.gender === 'string' &&
    ['Female', 'Male', 'Genderless', 'unknown'].includes(obj.gender) &&
    typeof obj.image === 'string' &&
    Array.isArray(obj.episode)
  );
}

/**
 * Transformar datos del personaje para display
 */
export function transformCharacterForDisplay(character: Character) {
  return {
    ...character,
    displayStatus: getStatusInSpanish(character.status),
    displayGender: getGenderInSpanish(character.gender),
    episodeCount: character.episode.length,
    hasOrigin: character.origin.name !== 'unknown',
    hasLocation: character.location.name !== 'unknown',
    imageAlt: `Imagen de ${character.name}`,
  };
}

/**
 * Obtener estado en español
 */
function getStatusInSpanish(status: Character['status']): string {
  switch (status) {
    case 'Alive':
      return 'Vivo';
    case 'Dead':
      return 'Muerto';
    case 'unknown':
      return 'Desconocido';
    default:
      return status;
  }
}

/**
 * Obtener género en español
 */
function getGenderInSpanish(gender: Character['gender']): string {
  switch (gender) {
    case 'Male':
      return 'Masculino';
    case 'Female':
      return 'Femenino';
    case 'Genderless':
      return 'Sin género';
    case 'unknown':
      return 'Desconocido';
    default:
      return gender;
  }
}

/**
 * Construir parámetros de query string
 */
export function buildQueryParams(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

/**
 * Parsear parámetros de URL
 */
export function parseQueryParams(queryString: string): Record<string, string> {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(queryString);
  
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

/**
 * Generar hash simple para caché
 */
export function generateCacheKey(prefix: string, params: unknown): string {
  const paramsString = JSON.stringify(params);
  const hash = btoa(paramsString).replace(/[+=\/]/g, '').substring(0, 8);
  return `${prefix}_${hash}`;
}

/**
 * Verificar si una respuesta está en caché y es válida
 */
export function isCacheValid(timestamp: number, ttlMinutes = 5): boolean {
  const now = Date.now();
  const ttlMs = ttlMinutes * 60 * 1000;
  return (now - timestamp) < ttlMs;
}

/**
 * Formatear error de API para mostrar al usuario
 */
export function formatApiError(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  
  if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 404) {
    return 'Personaje no encontrado';
  }
  
  return 'Ha ocurrido un error inesperado';
}

/**
 * Extraer nombre del episodio de la URL
 */
export function getEpisodeNameFromUrl(episodeUrl: string): string {
  const id = extractIdFromUrl(episodeUrl);
  return id ? `Episodio ${id}` : 'Episodio desconocido';
} 