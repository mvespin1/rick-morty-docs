// Hook para manejar lista de personajes
// Incluye fetch, paginación y filtros 
import { useEffect, useCallback } from 'react';
import { useCharacterStore } from '@/store/character-store';
import { useNotifications } from '@/store/app-store';
import type { CharacterFilters } from '@/types/api';

export const useCharacters = () => {
  const {
    characters,
    currentPage,
    totalPages,
    isLoading,
    error,
    filters,
    fetchCharacters,
    searchCharacters,
    setFilters,
  } = useCharacterStore();

  const { showError, showSuccess } = useNotifications();

  // Cargar personajes iniciales
  useEffect(() => {
    if (characters.length === 0 && !isLoading) {
      fetchCharacters(1);
    }
  }, [characters.length, isLoading, fetchCharacters]);

  // Manejar errores
  useEffect(() => {
    if (error) {
      showError('Error al cargar personajes', error);
    }
  }, [error, showError]);

  // Función para cambiar página
  const goToPage = useCallback(async (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      try {
        if (Object.keys(filters).length > 0) {
          await searchCharacters({ ...filters, page });
        } else {
          await fetchCharacters(page);
        }
        showSuccess(`Página ${page} cargada`);
      } catch (err) {
        showError('Error al cambiar página');
      }
    }
  }, [currentPage, totalPages, filters, searchCharacters, fetchCharacters, showSuccess, showError]);

  // Función para aplicar filtros
  const applyFilters = useCallback(async (newFilters: CharacterFilters) => {
    try {
      setFilters(newFilters);
      await searchCharacters({ ...newFilters, page: 1 });
      
      const filterCount = Object.keys(newFilters).length;
      if (filterCount > 0) {
        showSuccess(`Filtros aplicados (${filterCount})`);
      }
    } catch (err) {
      showError('Error al aplicar filtros');
    }
  }, [searchCharacters, setFilters, showSuccess, showError]);

  // Función para limpiar filtros
  const clearFilters = useCallback(async () => {
    try {
      setFilters({});
      await fetchCharacters(1);
      showSuccess('Filtros eliminados');
    } catch (err) {
      showError('Error al limpiar filtros');
    }
  }, [fetchCharacters, setFilters, showSuccess, showError]);

  // Función para refrescar
  const refresh = useCallback(async () => {
    try {
      await fetchCharacters(1);
      showSuccess('Lista actualizada');
    } catch (err) {
      showError('Error al actualizar');
    }
  }, [fetchCharacters, showSuccess, showError]);

  // Información de paginación
  const pagination = {
    currentPage,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    goToPage,
    nextPage: () => goToPage(currentPage + 1),
    prevPage: () => goToPage(currentPage - 1),
  };

  return {
    // Datos
    characters,
    isLoading,
    error,
    filters,
    
    // Paginación
    pagination,
    
    // Acciones
    applyFilters,
    clearFilters,
    refresh,
    
    // Estado
    isEmpty: characters.length === 0 && !isLoading,
    hasFilters: Object.keys(filters).length > 0,
  };
}; 