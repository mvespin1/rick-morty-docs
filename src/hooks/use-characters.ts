'use client';

// Hook para manejar lista de personajes con Infinite Scroll
import { useEffect, useCallback } from 'react';
import { useCharacterStore } from '@/store/character-store';
import { useNotifications } from '@/store/app-store';
import type { CharacterFilters } from '@/types/api';

export const useCharacters = () => {
  const {
    characters,
    currentPage,
    totalPages,
    hasNextPage,
    isLoading,
    error,
    filters,
    fetchCharacters,
    loadMoreCharacters,
    searchCharacters,
    setFilters,
    resetCharacters,
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

  // Función para cargar más personajes (infinite scroll)
  const loadMore = useCallback(async () => {
    if (!hasNextPage || isLoading) return;
    
    try {
      await loadMoreCharacters();
    } catch {
      showError('Error al cargar más personajes');
    }
  }, [hasNextPage, isLoading, loadMoreCharacters, showError]);

  // Función para aplicar filtros (resetea la lista)
  const applyFilters = useCallback(async (newFilters: CharacterFilters) => {
    try {
      setFilters(newFilters);
      await searchCharacters({ ...newFilters, page: 1 });
      
      const filterCount = Object.keys(newFilters).length;
      if (filterCount > 0) {
        showSuccess(`Filtros aplicados (${filterCount})`);
      }
    } catch {
      showError('Error al aplicar filtros');
    }
  }, [searchCharacters, setFilters, showSuccess, showError]);

  // Función para limpiar filtros (resetea la lista)
  const clearFilters = useCallback(async () => {
    try {
      resetCharacters();
      setFilters({});
      await fetchCharacters(1);
      showSuccess('Filtros eliminados');
    } catch {
      showError('Error al limpiar filtros');
    }
  }, [fetchCharacters, setFilters, resetCharacters, showSuccess, showError]);

  // Función para refrescar (resetea la lista)
  const refresh = useCallback(async () => {
    try {
      resetCharacters();
      await fetchCharacters(1);
      showSuccess('Lista actualizada');
    } catch {
      showError('Error al actualizar');
    }
  }, [fetchCharacters, resetCharacters, showSuccess, showError]);

  return {
    // Datos
    characters,
    isLoading,
    error,
    filters,
    
    // Infinite Scroll
    hasNextPage,
    loadMore,
    currentPage,
    totalPages,
    
    // Acciones
    applyFilters,
    clearFilters,
    refresh,
    
    // Estado
    isEmpty: characters.length === 0 && !isLoading,
    hasFilters: Object.keys(filters).length > 0,
    totalCharacters: characters.length,
  };
}; 