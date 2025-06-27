// Tipos comunes y reutilizables
// Estados, errores, paginación 

// Tipos comunes para estados y utilidades

// Estado base para llamadas asíncronas
export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

// Estado para datos paginados
export interface PaginatedState<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Estados de búsqueda
export interface SearchState<T> {
  query: string;
  results: T[];
  isSearching: boolean;
  hasSearched: boolean;
  lastSearchId: number | null;
  error: string | null;
}

// Estado para IA
export interface AIState {
  isGenerating: boolean;
  description: string | null;
  error: string | null;
  lastGeneratedId: number | null;
}

// Ordenamiento
export type SortOrder = 'asc' | 'desc';

// Tipos para componentes comunes
export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export interface ErrorProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
}

// Utilidades
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined; 