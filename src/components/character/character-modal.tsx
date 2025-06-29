// Modal de detalle de personaje
'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Modal } from '../ui/modal';
import { CharacterDetail } from './character-detail';
import { LoadingSpinner } from '../common/loading-spinner';
import type { Character } from '@/types/api';

interface CharacterModalProps {
  isOpen: boolean;
  character: Character | null;
  isLoading?: boolean;
  aiDescription?: string | null;
  isGeneratingAI?: boolean;
  onClose: () => void;
  onGenerateAI?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  canNavigateNext?: boolean;
  canNavigatePrev?: boolean;
}

export function CharacterModal({
  isOpen,
  character,
  isLoading = false,
  aiDescription,
  isGeneratingAI = false,
  onClose,
  onGenerateAI,
  onNavigateNext,
  onNavigatePrev,
  canNavigateNext = false,
  canNavigatePrev = false
}: CharacterModalProps) {
  if (!character && !isLoading) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      className="relative"
    >
      {/* Navegación entre personajes */}
      {(canNavigateNext || canNavigatePrev) && (
        <div className="absolute top-4 right-16 flex items-center gap-2 z-10">
          <button
            onClick={onNavigatePrev}
            disabled={!canNavigatePrev || isLoading}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-full shadow-md hover:shadow-lg transition-all"
            title="Personaje anterior"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onNavigateNext}
            disabled={!canNavigateNext || isLoading}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-full shadow-md hover:shadow-lg transition-all"
            title="Siguiente personaje"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Contenido */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner text="Cargando detalles del personaje..." />
          </div>
        ) : character ? (
          <CharacterDetail
            character={character}
            onGenerateAI={onGenerateAI}
            aiDescription={aiDescription}
            isGeneratingAI={isGeneratingAI}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <div className="text-4xl mb-4">🤖</div>
            <p>No se pudo cargar el personaje</p>
          </div>
        )}
      </div>
    </Modal>
  );
} 