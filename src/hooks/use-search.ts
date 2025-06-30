'use client';

// Hook simplificado para manejar búsquedas
import { useState, useCallback } from 'react';
import { useCharacterStore } from '@/store/character-store';
import { useNotifications } from '@/store/app-store';
import { isValidCharacterId } from '@/lib/utils';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  
  const {
    searchById,
    results,
    isSearching,
    selectedId,
    setSelectedId,
  } = useCharacterStore();

  const { showError, showSuccess } = useNotifications();

  // Función para buscar por ID
  const searchSpecificId = useCallback(async (id: number) => {
    if (!isValidCharacterId(id)) {
      showError('ID inválido', `El ID ${id} no es válido (1-826)`);
      return;
    }

    try {
      setSelectedId(id);
      await searchById(id);
      showSuccess(`Personaje ${id} encontrado`);
    } catch {
      showError('Personaje no encontrado', `No existe el personaje con ID ${id}`);
    }
  }, [searchById, setSelectedId, showSuccess, showError]);

  // Manejar cambio en el input
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  // Ejecutar búsqueda
  const executeSearch = useCallback(async () => {
    const trimmed = query.trim();
    
    if (!trimmed) {
      showError('Búsqueda vacía', 'Ingresa un ID para buscar');
      return;
    }

    const id = parseInt(trimmed, 10);
    if (isNaN(id)) {
      showError('ID inválido', 'Ingresa solo números');
      return;
    }

    await searchSpecificId(id);
  }, [query, searchSpecificId, showError]);

  // Limpiar búsqueda
  const clear = useCallback(() => {
    setQuery('');
    setSelectedId(null);
  }, [setSelectedId]);

  return {
    // Estado
    query,
    results,
    isSearching,
    selectedId,
    
    // Estado calculado
    hasResults: results.length > 0,
    isEmpty: results.length === 0 && !isSearching && query.trim() !== '',
    
    // Acciones
    setQuery: handleQueryChange,
    executeSearch,
    searchSpecificId,
    clear,
    
    // Helpers
    isValidId: isValidCharacterId,
  };
}; 