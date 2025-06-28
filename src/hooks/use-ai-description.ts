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

  const { showError, showSuccess, showInfo, showWarning } = useNotifications();

  // Función para generar descripción
  const generate = useCallback(async (character: Character) => {
    try {
      // Verificar configuración antes de mostrar loading
      if (!geminiApi.isConfigured()) {
        showWarning(
          'IA no configurada',
          'Se generará una descripción básica. Para usar IA, configura tu API key de Gemini.'
        );
        await generateAIDescription(character);
        showInfo('Descripción generada', 'Se ha creado una descripción básica del personaje');
        return;
      }

      showInfo('Generando descripción con IA...', 'Esto puede tomar unos segundos');
      await generateAIDescription(character);
      showSuccess('Descripción generada con IA', 'La IA ha creado una descripción única del personaje');
      
    } catch (error) {
      // Solo mostrar error si no es por falta de configuración
      if (geminiApi.isConfigured()) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        showError(
          'Error al generar con IA', 
          `${errorMessage}. Se ha generado una descripción básica en su lugar.`
        );
      }
    }
  }, [generateAIDescription, showError, showSuccess, showInfo, showWarning]);

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