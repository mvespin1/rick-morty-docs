// Tipos específicos para el dominio de personajes
import type { Character, CharacterFilters } from './api';
import type { PaginatedState, SearchState, AIState } from './common';

// Estados del store de personajes
export interface CharacterState extends PaginatedState<Character> {
  characters: Character[];
  filters: CharacterFilters;
}

export interface CharacterDetailState {
  character: Character | null;
  isLoading: boolean;
  error: string | null;
}

export interface CharacterSearchState extends SearchState<Character> {
  selectedId: number | null;
}

export interface CharacterAIState extends AIState {
  characterId: number | null;
}

// Props para componentes de personajes
export interface CharacterCardProps {
  character: Character;
  onClick: (character: Character) => void;
  showStatus?: boolean;
  className?: string;
}

export interface CharacterGridProps {
  characters: Character[];
  isLoading?: boolean;
  onCharacterClick: (character: Character) => void;
  className?: string;
}

export interface CharacterDetailProps {
  character: Character;
  onGenerateAI?: () => void;
  aiDescription?: string | null;
  isGeneratingAI?: boolean;
  className?: string;
}

export interface CharacterSearchProps {
  onSearch: (query: string) => void;
  onSearchById: (id: number) => void;
  isSearching?: boolean;
  placeholder?: string;
  className?: string;
}

export interface AIDescriptionProps {
  character: Character;
  description?: string | null;
  isGenerating?: boolean;
  onGenerate: () => void;
  className?: string;
}

// Filtros específicos para UI
export interface CharacterFiltersUI extends CharacterFilters {
  resetFilters: () => void;
  applyFilters: (filters: CharacterFilters) => void;
}

// Tipos para ordenamiento de personajes
export type CharacterSortBy = 'id' | 'name' | 'status' | 'species' | 'created';

export interface CharacterSort {
  field: CharacterSortBy;
  order: 'asc' | 'desc';
} 