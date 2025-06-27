// Servicio API específico para personajes
import { apiClient } from './api';
import { API_ENDPOINTS, DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { isValidCharacterId } from '@/lib/utils';
import type { 
  Character, 
  ApiResponse, 
  CharacterFilters 
} from '@/types/api';

class CharacterApiService {
  private readonly endpoint = API_ENDPOINTS.CHARACTERS;

  /**
   * Obtener todos los personajes con paginación
   */
  async getAllCharacters(page = 1): Promise<ApiResponse<Character>> {
    const params = { page };
    return apiClient.get<ApiResponse<Character>>(this.endpoint, params);
  }

  /**
   * Obtener un personaje por ID
   */
  async getCharacterById(id: number): Promise<Character> {
    if (!isValidCharacterId(id)) {
      throw new Error(`ID de personaje inválido: ${id}`);
    }
    
    return apiClient.get<Character>(`${this.endpoint}/${id}`);
  }

  /**
   * Obtener múltiples personajes por IDs
   */
  async getMultipleCharacters(ids: number[]): Promise<Character[]> {
    if (!ids.length) {
      throw new Error('Debe proporcionar al menos un ID');
    }

    // Validar todos los IDs
    const invalidIds = ids.filter(id => !isValidCharacterId(id));
    if (invalidIds.length > 0) {
      throw new Error(`IDs inválidos: ${invalidIds.join(', ')}`);
    }

    const idsParam = ids.join(',');
    return apiClient.get<Character[]>(`${this.endpoint}/${idsParam}`);
  }

  /**
   * Buscar personajes con filtros
   */
  async searchCharacters(filters: CharacterFilters): Promise<ApiResponse<Character>> {
    const cleanFilters = this.cleanFilters(filters);
    return apiClient.get<ApiResponse<Character>>(this.endpoint, cleanFilters);
  }

  /**
   * Buscar personajes por nombre
   */
  async searchByName(name: string, page = 1): Promise<ApiResponse<Character>> {
    if (!name.trim()) {
      throw new Error('El nombre no puede estar vacío');
    }

    const params = { name: name.trim(), page };
    return apiClient.get<ApiResponse<Character>>(this.endpoint, params);
  }

  /**
   * Filtrar personajes por estado
   */
  async getByStatus(
    status: Character['status'], 
    page = 1
  ): Promise<ApiResponse<Character>> {
    const params = { status, page };
    return apiClient.get<ApiResponse<Character>>(this.endpoint, params);
  }

  /**
   * Filtrar personajes por especie
   */
  async getBySpecies(
    species: string, 
    page = 1
  ): Promise<ApiResponse<Character>> {
    const params = { species: species.trim(), page };
    return apiClient.get<ApiResponse<Character>>(this.endpoint, params);
  }

  /**
   * Filtrar personajes por género
   */
  async getByGender(
    gender: Character['gender'], 
    page = 1
  ): Promise<ApiResponse<Character>> {
    const params = { gender, page };
    return apiClient.get<ApiResponse<Character>>(this.endpoint, params);
  }

  /**
   * Obtener personajes aleatorios (usando la primera página)
   */
  async getRandomCharacters(count = DEFAULT_PAGE_SIZE): Promise<Character[]> {
    const response = await this.getAllCharacters(1);
    return response.results.slice(0, count);
  }

  /**
   * Limpiar filtros removiendo valores vacíos
   */
  private cleanFilters(filters: CharacterFilters): CharacterFilters {
    const cleaned: CharacterFilters = {};
    
    if (filters.name) {
      const trimmed = filters.name.trim();
      if (trimmed) cleaned.name = trimmed;
    }
    
    if (filters.status) cleaned.status = filters.status;
    if (filters.species) {
      const trimmed = filters.species.trim();
      if (trimmed) cleaned.species = trimmed;
    }
    
    if (filters.type) {
      const trimmed = filters.type.trim();
      if (trimmed) cleaned.type = trimmed;
    }
    
    if (filters.gender) cleaned.gender = filters.gender;
    if (filters.page && filters.page > 0) cleaned.page = filters.page;

    return cleaned;
  }

  /**
   * Construir URL para "Try it out"
   */
  buildUrl(filters?: CharacterFilters, id?: number): string {
    const baseUrl = `${apiClient.getInstance().defaults.baseURL}${this.endpoint}`;
    
    if (id) {
      return `${baseUrl}/${id}`;
    }

    if (!filters || Object.keys(filters).length === 0) {
      return baseUrl;
    }

    const cleanFilters = this.cleanFilters(filters);
    const searchParams = new URLSearchParams();
    
    Object.entries(cleanFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    return `${baseUrl}?${searchParams.toString()}`;
  }
}

// Exportar instancia singleton
export const characterApi = new CharacterApiService();
export default characterApi; 