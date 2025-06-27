// Hook para generar descripciones con IA
import { useCallback } from 'react';
import { useCharacterStore } from '@/store/character-store';
import { useNotifications } from '@/store/app-store';
import type { Character } from '@/types/api';

export const useAIDescription = () => {
  const {
    description,
    isGenerating,
    characterId,
    generateAIDescription,
  } = useCharacterStore();

  const { showError, showSuccess, showInfo } = useNotifications();

  // Función para generar descripción
  const generate = useCallback(async (character: Character) => {
    try {
      showInfo('Generando descripción...', 'Esto puede tomar unos segundos');
      await generateAIDescription(character);
      showSuccess('Descripción generada', 'La IA ha creado una descripción única');
    } catch (error) {
      showError('Error al generar descripción', 'Intenta nuevamente más tarde');
    }
  }, [generateAIDescription, showError, showSuccess, showInfo]);

  // Verificar si ya existe descripción para el personaje
  const hasDescriptionFor = useCallback((charId: number) => {
    return characterId === charId && !!description;
  }, [characterId, description]);

  // Obtener descripción para personaje específico
  const getDescriptionFor = useCallback((charId: number) => {
    if (hasDescriptionFor(charId)) {
      return description;
    }
    return null;
  }, [hasDescriptionFor, description]);

  return {
    // Estado
    description,
    isGenerating,
    characterId,
    
    // Acciones
    generate,
    
    // Helpers
    hasDescriptionFor,
    getDescriptionFor,
    
    // Estado calculado
    canGenerate: !isGenerating,
  };
}; 