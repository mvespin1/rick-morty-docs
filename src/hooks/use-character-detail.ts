'use client';

// Hook para manejar detalle de personaje individual
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCharacterStore } from '@/store/character-store';
import { useNotifications } from '@/store/app-store';

export const useCharacterDetail = (id: number | string) => {
  const router = useRouter();
  const {
    character,
    isLoading,
    error,
    fetchCharacterById,
  } = useCharacterStore();

  const { showError, showSuccess } = useNotifications();

  // Convertir ID a número
  const characterId = typeof id === 'string' ? parseInt(id, 10) : id;

  // Cargar personaje cuando cambia el ID (sin validación extra)
  useEffect(() => {
    // Solo cargar si no está ya cargado y el ID es válido
    if (!isNaN(characterId) && (!character || character.id !== characterId)) {
      fetchCharacterById(characterId);
    }
  }, [characterId, character, fetchCharacterById]);

  // Función para refrescar
  const refresh = useCallback(async () => {
    try {
      await fetchCharacterById(characterId);
      showSuccess('Personaje actualizado');
    } catch (err) {
      showError('Error al actualizar personaje');
    }
  }, [characterId, fetchCharacterById, showSuccess, showError]);

  // Función para navegar a otro personaje
  const goToCharacter = useCallback((newId: number) => {
    if (newId >= 1 && newId <= 826) {
      router.push(`/character/${newId}`);
    } else {
      showError('ID inválido', `El ID ${newId} no es válido`);
    }
  }, [router, showError]);

  // Navegación entre personajes
  const navigation = {
    goNext: () => {
      const nextId = characterId + 1;
      if (nextId <= 826) {
        goToCharacter(nextId);
      } else {
        showError('Límite alcanzado', 'No hay más personajes');
      }
    },
    goPrev: () => {
      const prevId = characterId - 1;
      if (prevId >= 1) {
        goToCharacter(prevId);
      } else {
        showError('Límite alcanzado', 'No hay personajes anteriores');
      }
    },
    goToCharacter,
    canGoNext: characterId < 826,
    canGoPrev: characterId > 1,
  };

  return {
    // Datos
    character,
    characterId,
    isLoading,
    error,
    
    // Estado
    isValid: !isNaN(characterId),
    isLoaded: !!character && character.id === characterId,
    
    // Acciones
    refresh,
    navigation,
  };
}; 