// Store de Zustand para personajes
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { characterApi } from '@/services/character-api';
import { geminiApi } from '@/services/gemini-api';
import { formatApiError } from '@/services/utils';
import type { 
  Character, 
  CharacterFilters, 
  ApiResponse 
} from '@/types/api';
import type {
  CharacterState,
  CharacterDetailState,
  CharacterSearchState,
  CharacterAIState
} from '@/types/character';

interface CharacterStore extends 
  CharacterState, 
  CharacterDetailState, 
  CharacterSearchState, 
  CharacterAIState {
  
  // Acciones para lista de personajes
  fetchCharacters: (page?: number) => Promise<void>;
  searchCharacters: (filters: CharacterFilters) => Promise<void>;
  loadMoreCharacters: () => Promise<void>;
  resetCharacters: () => void;
  
  // Acciones para detalle de personaje
  fetchCharacterById: (id: number) => Promise<Character | null>;
  clearCharacterDetail: () => void;
  
  // Acciones para búsqueda
  searchByName: (name: string) => Promise<void>;
  searchById: (id: number) => Promise<void>;
  clearSearch: () => void;
  setSelectedId: (id: number | null) => void;
  
  // Acciones para IA
  generateAIDescription: (character: Character) => Promise<void>;
  clearAIDescription: () => void;
  
  // Acciones de filtros
  setFilters: (filters: CharacterFilters) => void;
  resetFilters: () => void;
  
  // Utilidades
  getCurrentRequestUrl: () => string;
  isCharacterLoaded: (id: number) => boolean;
}

const initialState = {
  // Lista de personajes
  characters: [],
  data: [],
  currentPage: 1,
  totalPages: 0,
  totalCount: 0,
  isLoading: false,
  error: null,
  hasNextPage: false,
  hasPrevPage: false,
  filters: {},
  
  // Detalle de personaje
  character: null,
  
  // Búsqueda
  query: '',
  results: [],
  isSearching: false,
  hasSearched: false,
  lastSearchId: null,
  selectedId: null,
  
  // IA
  isGenerating: false,
  description: null,
  lastGeneratedId: null,
  characterId: null,
};

export const useCharacterStore = create<CharacterStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Obtener personajes con paginación
      fetchCharacters: async (page = 1) => {
        const { filters } = get();
        
        set({ isLoading: true, error: null });
        
        try {
          let response: ApiResponse<Character>;
          
          if (Object.keys(filters).length > 0) {
            response = await characterApi.searchCharacters({ ...filters, page });
          } else {
            response = await characterApi.getAllCharacters(page);
          }
          
          set({
            characters: response.results,
            data: response.results,
            currentPage: page,
            totalPages: response.info.pages,
            totalCount: response.info.count,
            hasNextPage: !!response.info.next,
            hasPrevPage: !!response.info.prev,
            isLoading: false,
          });
          
        } catch (error) {
          set({
            error: formatApiError(error),
            isLoading: false,
          });
        }
      },

      // Buscar personajes con filtros
      searchCharacters: async (filters: CharacterFilters) => {
        set({ 
          isLoading: true, 
          error: null, 
          filters,
          currentPage: 1 
        });
        
        try {
          const response = await characterApi.searchCharacters(filters);
          
          set({
            characters: response.results,
            data: response.results,
            totalPages: response.info.pages,
            totalCount: response.info.count,
            hasNextPage: !!response.info.next,
            hasPrevPage: !!response.info.prev,
            isLoading: false,
          });
          
        } catch (error) {
          set({
            error: formatApiError(error),
            isLoading: false,
            characters: [],
            data: [],
          });
        }
      },

      // Cargar más personajes (infinite scroll)
      loadMoreCharacters: async () => {
        const { currentPage, hasNextPage, isLoading, filters, characters } = get();
        
        if (!hasNextPage || isLoading) return;
        
        const nextPage = currentPage + 1;
        set({ isLoading: true, error: null });
        
        try {
          let response: ApiResponse<Character>;
          
          if (Object.keys(filters).length > 0) {
            response = await characterApi.searchCharacters({ ...filters, page: nextPage });
          } else {
            response = await characterApi.getAllCharacters(nextPage);
          }
          
          // Agregar nuevos personajes a la lista existente
          set({
            characters: [...characters, ...response.results],
            data: [...characters, ...response.results],
            currentPage: nextPage,
            totalPages: response.info.pages,
            totalCount: response.info.count,
            hasNextPage: !!response.info.next,
            hasPrevPage: !!response.info.prev,
            isLoading: false,
          });
          
        } catch (error) {
          set({
            error: formatApiError(error),
            isLoading: false,
          });
        }
      },

      // Resetear lista de personajes
      resetCharacters: () => {
        set({
          characters: [],
          data: [],
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPrevPage: false,
          error: null,
          filters: {},
        });
      },

      // Obtener personaje por ID
      fetchCharacterById: async (id: number): Promise<Character | null> => {
        set({ isLoading: true, error: null, character: null });
        
        try {
          const character = await characterApi.getCharacterById(id);
          set({
            character,
            isLoading: false,
          });
          
          return character;
          
        } catch (error) {
          set({
            error: formatApiError(error),
            isLoading: false,
            character: null,
          });
          
          return null;
        }
      },

      // Limpiar detalle de personaje
      clearCharacterDetail: () => {
        set({
          character: null,
          error: null,
        });
      },

      // Buscar por nombre
      searchByName: async (name: string) => {
        if (!name.trim()) {
          get().clearSearch();
          return;
        }
        
        set({ 
          isSearching: true, 
          error: null, 
          query: name.trim(),
          hasSearched: false 
        });
        
        try {
          const response = await characterApi.searchByName(name.trim());
          set({
            results: response.results,
            isSearching: false,
            hasSearched: true,
            lastSearchId: null,
          });
          
        } catch (error) {
          set({
            error: formatApiError(error),
            isSearching: false,
            hasSearched: true,
            results: [],
          });
        }
      },

      // Buscar por ID
      searchById: async (id: number) => {
        set({ 
          isSearching: true, 
          error: null, 
          selectedId: id,
          hasSearched: false 
        });
        
        try {
          const character = await characterApi.getCharacterById(id);
          set({
            results: [character],
            isSearching: false,
            hasSearched: true,
            lastSearchId: id,
            query: '',
          });
          
        } catch (error) {
          set({
            error: formatApiError(error),
            isSearching: false,
            hasSearched: true,
            results: [],
          });
        }
      },

      // Limpiar búsqueda
      clearSearch: () => {
        set({
          query: '',
          results: [],
          isSearching: false,
          hasSearched: false,
          lastSearchId: null,
          selectedId: null,
          error: null,
        });
      },

      // Establecer ID seleccionado
      setSelectedId: (id: number | null) => {
        set({ selectedId: id });
      },

      // Generar descripción con IA
      generateAIDescription: async (character: Character) => {
        set({ 
          isGenerating: true, 
          error: null, 
          characterId: character.id 
        });
        
        try {
          // El servicio ahora maneja automáticamente fallbacks sin lanzar errores
          const description = await geminiApi.generateCharacterDescription(character);
          set({
            description,
            isGenerating: false,
            lastGeneratedId: character.id,
            error: null,
          });
          
        } catch (error) {
          console.warn('Error generando descripción con IA, el servicio no está disponible');
          
          // Si el servicio falla completamente, mostrar mensaje de configuración
          set({
            description: `🤖 Servicio de IA no disponible. ${geminiApi.getConfigurationMessage()}`,
            isGenerating: false,
            lastGeneratedId: character.id, 
            error: null,
          });
        }
      },

      // Limpiar descripción de IA
      clearAIDescription: () => {
        set({
          description: null,
          isGenerating: false,
          lastGeneratedId: null,
          characterId: null,
        });
      },

      // Establecer filtros
      setFilters: (filters: CharacterFilters) => {
        set({ filters });
      },

      // Resetear filtros
      resetFilters: () => {
        set({ filters: {} });
        get().fetchCharacters(1);
      },

      // Obtener URL actual de la request
      getCurrentRequestUrl: () => {
        const { filters, selectedId } = get();
        return characterApi.buildUrl(filters, selectedId || undefined);
      },

      // Verificar si un personaje está cargado
      isCharacterLoaded: (id: number) => {
        const { character, characters } = get();
        return (
          (character && character.id === id) ||
          characters.some(c => c.id === id)
        );
      },
    }),
    {
      name: 'character-store',
    }
  )
); 