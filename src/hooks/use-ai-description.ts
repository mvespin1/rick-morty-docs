'use client';

// Hook para generar descripciones con IA
import { useCallback } from 'react';
import { useCharacterStore } from '@/store/character-store';
import { useNotifications } from '@/store/app-store';
import { geminiApi } from '@/services/gemini-api';
import type { Character } from '@/types/api';

export const useAIDescription = (targetCharacterId: number | null) => {
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
      showInfo('Generando descripción con IA...', 'Esto puede tomar unos segundos');
      await generateAIDescription(character);
      
      // Siempre mostrar éxito ya que el servicio maneja fallbacks automáticamente
      if (geminiApi.isConfigured()) {
        showSuccess('Descripción generada con IA', 'La IA ha creado una descripción única del personaje');
      } else {
        showInfo('Descripción generada', 'Se ha creado una descripción creativa del personaje');
      }
      
    } catch (error) {
      // Esto solo ocurriría en casos extremos
      console.error('Error crítico:', error);
      showError('Error inesperado', 'Ocurrió un problema inesperado. Por favor, intenta nuevamente.');
    }
  }, [generateAIDescription, showError, showSuccess, showInfo]);

  // Función simple para generar descripción del personaje actual
  const generateForCurrent = useCallback(async () => {
    if (!targetCharacterId) {
      showError('Error', 'No hay personaje seleccionado');
      return;
    }
    
    // Necesitamos el objeto character completo, pero como este hook es específico
    // para un personaje ya cargado, asumimos que el personaje está disponible
    // Este método será llamado desde el componente que tiene el character object
    showError('Error', 'Usa generate(character) con el objeto completo');
  }, [targetCharacterId, showError]);

  // Verificar si ya existe descripción para el personaje target
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

  // Determinar si la descripción actual es para el personaje target
  const currentDescription = targetCharacterId === characterId ? description : null;
  const isGeneratingForCurrent = targetCharacterId === characterId ? isGenerating : false;

  return {
    // Estado
    description: currentDescription,
    isGenerating: isGeneratingForCurrent,
    characterId: targetCharacterId,
    
    // Acciones
    generate,
    generateForCurrent,
    
    // Helpers
    hasDescriptionFor,
    getDescriptionFor,
    
    // Estado calculado
    canGenerate: !isGeneratingForCurrent,
    isConfigured: geminiApi.isConfigured(),
  };
}; 