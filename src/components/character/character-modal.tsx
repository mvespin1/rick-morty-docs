// Modal de detalle de personaje
'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Modal } from '../ui/modal';
import { CompactCharacterDetail } from './character-detail';
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
      size="full"
      className="relative animate-fade-in-scale hover:glow-primary"
    >
      {/* Navegación entre personajes con efectos mejorados */}
      {(canNavigateNext || canNavigatePrev) && (
        <div className="absolute top-4 right-16 flex items-center gap-3 z-10 animate-fade-in">
          <button
            onClick={onNavigatePrev}
            disabled={!canNavigatePrev || isLoading}
            className="p-3 text-muted-foreground hover:text-white disabled:opacity-30 disabled:cursor-not-allowed backdrop-dark rounded-full elegant-shadow-lg hover:glow-subtle transition-all duration-300 interactive-element hover:scale-110 group"
            title="Personaje anterior"
          >
            <ArrowLeft className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>
          <button
            onClick={onNavigateNext}
            disabled={!canNavigateNext || isLoading}
            className="p-3 text-muted-foreground hover:text-white disabled:opacity-30 disabled:cursor-not-allowed backdrop-dark rounded-full elegant-shadow-lg hover:glow-subtle transition-all duration-300 interactive-element hover:scale-110 group"
            title="Siguiente personaje"
          >
            <ArrowRight className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>
      )}

      {/* Contenido */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
          <div className="text-center space-y-4">
            <div className="p-4 gradient-primary rounded-full w-fit mx-auto glow-subtle animate-float">
              <LoadingSpinner size="lg" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gradient mb-2">Cargando personaje...</h3>
              <p className="text-muted-foreground text-sm">Obteniendo detalles del multiverso</p>
            </div>
          </div>
        </div>
      ) : character ? (
        <div className="animate-fade-in-scale">
          <CompactCharacterDetail
            character={character}
            onClose={onClose}
            onGenerateAI={onGenerateAI}
            aiDescription={aiDescription}
            isGeneratingAI={isGeneratingAI}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground animate-fade-in">
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4 glow-subtle animate-float">🤖</div>
            <div>
              <h3 className="text-xl font-bold text-gradient mb-2">¡Ups! Algo salió mal</h3>
              <p className="text-lg font-medium text-muted-foreground mb-4">No se pudo cargar el personaje</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 interactive-element hover:scale-105 elegant-shadow"
              >
                Volver a intentar
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}