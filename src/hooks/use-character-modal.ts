'use client';

// Hook para manejar detalle de personaje en modal
import { useState, useCallback } from 'react';
import { useCharacterStore } from '@/store/character-store';
import { useNotifications } from '@/store/app-store';
import type { Character } from '@/types/api';

export const useCharacterModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const { 
    fetchCharacterById,
    character: storeCharacter,
    generateAIDescription,
    description,
    isGenerating,
    lastGeneratedId,
    clearAIDescription
  } = useCharacterStore();

  const { showError, showSuccess } = useNotifications();

  // Abrir modal con personaje
  const openModal = useCallback(async (character: Character) => {
    setSelectedCharacter(character);
    setIsOpen(true);
    
    // Si el personaje pasado no tiene toda la información, cargar detalles completos
    if (!character.episode || character.episode.length === 0) {
      setIsLoadingDetail(true);
      try {
        await fetchCharacterById(character.id);
        // Después del fetch, el character estará en storeCharacter
        setSelectedCharacter(storeCharacter || character);
      } catch (error) {
        showError('Error al cargar detalles del personaje');
      } finally {
        setIsLoadingDetail(false);
      }
    }
  }, [fetchCharacterById, storeCharacter, showError]);

  // Cerrar modal
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedCharacter(null);
    setIsLoadingDetail(false);
    clearAIDescription();
  }, [clearAIDescription]);

  // Generar descripción IA
  const handleGenerateAI = useCallback(async () => {
    if (!selectedCharacter) return;

    try {
      await generateAIDescription(selectedCharacter);
      showSuccess('Descripción generada con IA');
    } catch (error) {
      // El error ya se maneja en el store con fallback
      console.log('Usando descripción de respaldo');
    }
  }, [selectedCharacter, generateAIDescription, showSuccess]);

  // Navegación entre personajes en el modal
  const navigateToCharacter = useCallback(async (id: number) => {
    if (id === selectedCharacter?.id) return;

    setIsLoadingDetail(true);
    try {
      await fetchCharacterById(id);
      // Usar el character del store después del fetch
      if (storeCharacter && storeCharacter.id === id) {
        setSelectedCharacter(storeCharacter);
      }
    } catch (error) {
      showError(`Error al cargar personaje ${id}`);
    } finally {
      setIsLoadingDetail(false);
    }
  }, [selectedCharacter?.id, fetchCharacterById, storeCharacter, showError]);

  return {
    // Estado del modal
    isOpen,
    selectedCharacter,
    isLoadingDetail,
    
    // Acciones del modal
    openModal,
    closeModal,
    
    // IA
    aiDescription: lastGeneratedId === selectedCharacter?.id ? description : null,
    isGeneratingAI: isGenerating,
    handleGenerateAI,
    
    // Navegación
    navigateToCharacter,
    
    // Estado calculado
    canNavigateNext: selectedCharacter ? selectedCharacter.id < 826 : false,
    canNavigatePrev: selectedCharacter ? selectedCharacter.id > 1 : false,
  };
}; 