'use client';

// Hook para manejar detalle de personaje individual
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCharacterStore } from '@/store/character-store';
import { useNotifications } from '@/store/app-store';
import { isValidCharacterId } from '@/lib/utils';

export const useCharacterDetail = (id: number | string) => {
  const router = useRouter();
  const {
    character,
    isLoading,
    error,
    fetchCharacterById,
  } = useCharacterStore();

  const { showError, showSuccess } = useNotifications();

  // Convertir ID a número y validar
  const characterId = typeof id === 'string' ? parseInt(id, 10) : id;
  const isValidId = isValidCharacterId(characterId);

  // Cargar personaje cuando cambia el ID
  useEffect(() => {
    if (isValidId) {
      // Solo cargar si no está ya cargado
      if (!character || character.id !== characterId) {
        fetchCharacterById(characterId);
      }
    } else {
      showError('ID de personaje inválido', `El ID ${id} no es válido`);
    }
  }, [characterId, isValidId, character, fetchCharacterById, showError, id]);

  // Manejar errores
  useEffect(() => {
    if (error && isValidId) {
      showError('Error al cargar personaje', error);
    }
  }, [error, isValidId, showError]);

  // Función para refrescar
  const refresh = useCallback(async () => {
    if (isValidId) {
      try {
        await fetchCharacterById(characterId);
        showSuccess('Personaje actualizado');
      } catch (err) {
        showError('Error al actualizar personaje');
      }
    }
  }, [characterId, isValidId, fetchCharacterById, showSuccess, showError]);

  // Función para navegar a otro personaje
  const goToCharacter = useCallback((newId: number) => {
    if (isValidCharacterId(newId)) {
      router.push(`/character/${newId}`);
    } else {
      showError('ID inválido', `El ID ${newId} no es válido`);
    }
  }, [router, showError]);

  // Navegación entre personajes
  const navigation = {
    goNext: () => {
      const nextId = characterId + 1;
      if (isValidCharacterId(nextId)) {
        goToCharacter(nextId);
      } else {
        showError('Límite alcanzado', 'No hay más personajes');
      }
    },
    goPrev: () => {
      const prevId = characterId - 1;
      if (isValidCharacterId(prevId)) {
        goToCharacter(prevId);
      } else {
        showError('Límite alcanzado', 'No hay personajes anteriores');
      }
    },
    goToCharacter,
    canGoNext: isValidCharacterId(characterId + 1),
    canGoPrev: isValidCharacterId(characterId - 1),
  };

  return {
    // Datos
    character,
    characterId,
    isLoading,
    error,
    
    // Estado
    isValid: isValidId,
    isLoaded: !!character && character.id === characterId,
    
    // Acciones
    refresh,
    navigation,
  };
}; 