// Constantes de la aplicación
// URLs de API, configuraciones, etc. 

// API Configuration
export const API_BASE_URL = 'https://rickandmortyapi.com/api';

export const API_ENDPOINTS = {
  CHARACTERS: '/character',
  LOCATIONS: '/location',
  EPISODES: '/episode',
} as const;

// Paginación
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE = 1;

// Estados de personajes
export const CHARACTER_STATUS = {
  ALIVE: 'Alive',
  DEAD: 'Dead',
  UNKNOWN: 'unknown',
} as const;

// Géneros de personajes
export const CHARACTER_GENDER = {
  FEMALE: 'Female',
  MALE: 'Male',
  GENDERLESS: 'Genderless',
  UNKNOWN: 'unknown',
} as const;

// Códigos de estado HTTP
export const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_REQUEST: 400,
} as const;

// Timeouts
export const API_TIMEOUT = 10000; // 10 segundos

// Configuración de búsqueda
export const SEARCH_CONFIG = {
  DEBOUNCE_DELAY: 500, // ms
  MIN_SEARCH_LENGTH: 1,
  MAX_SEARCH_LENGTH: 100,
} as const;

// Mensajes de error
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  TIMEOUT_ERROR: 'Tiempo de espera agotado. Intenta nuevamente.',
  NOT_FOUND: 'Personaje no encontrado. Intenta con otro ID.',
  GENERIC_ERROR: 'Ha ocurrido un error inesperado.',
  AI_ERROR: 'Error al generar descripción con IA.',
} as const;

// Configuración de la aplicación
export const APP_CONFIG = {
  NAME: 'Rick & Morty API Docs',
  DESCRIPTION: 'Documentación interactiva de la API de Rick & Morty',
  VERSION: '1.0.0',
} as const;

// URLs para navegación
export const ROUTES = {
  HOME: '/',
  CHARACTER_DETAIL: '/character',
} as const; 