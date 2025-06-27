// Tipos para la API de Rick & Morty
// Basado en la documentación oficial: https://rickandmortyapi.com/documentation

export interface ApiResponse<T> {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: T[];
}

export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

// Filtros para personajes
export interface CharacterFilters {
  name?: string;
  status?: Character['status'];
  species?: string;
  type?: string;
  gender?: Character['gender'];
  page?: number;
}

// Información de paginación
export interface PaginationInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

// Error de API
export interface ApiError {
  message: string;
  statusCode: number;
  details?: any;
} 