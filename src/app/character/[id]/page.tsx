'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CharacterDetail } from '@/components/character/character-detail';
import { CharacterNavigation } from '@/components/layout/navigation';
import { PageLoader } from '@/components/common/loading-spinner';
import { PageError } from '@/components/common/error-message';
import { useCharacterDetail } from '@/hooks/use-character-detail';
import { useAIDescription } from '@/hooks/use-ai-description';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CharacterDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  // Debug: ver qué está llegando en params
  console.log('🔍 Debug params:', params);
  console.log('🔍 Debug params.id:', params.id);
  
  // Parsing más robusto del ID
  const rawId = params.id;
  let characterId: number;
  
  if (Array.isArray(rawId)) {
    characterId = parseInt(rawId[0], 10);
  } else if (typeof rawId === 'string') {
    characterId = parseInt(rawId, 10);
  } else {
    characterId = NaN;
  }
  
  console.log('🔍 Debug characterId parsed:', characterId);
  console.log('🔍 Debug characterId isNaN:', isNaN(characterId));
  
  // Si el ID no es válido, redirigir a home
  if (isNaN(characterId) || characterId < 1 || characterId > 826) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageError 
            message="ID de personaje inválido"
            onRetry={() => router.push('/')}
          />
        </div>
      </main>
    );
  }

  const {
    character,
    isLoading,
    error,
    refresh,
    navigation
  } = useCharacterDetail(characterId);

  const {
    description,
    isGenerating,
    generate
  } = useAIDescription(character?.id || null);

  // Manejar navegación
  const handleGoBack = () => {
    router.back();
  };

  const handleGenerateAI = () => {
    if (character) {
      generate(character);
    }
  };

  // Manejar navegación entre personajes
  const handleNext = () => {
    if (navigation.canGoNext) {
      navigation.goNext();
    }
  };

  const handlePrevious = () => {
    if (navigation.canGoPrev) {
      navigation.goPrev();
    }
  };

  // Estados de carga y error
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageLoader text="Cargando información del personaje..." />
        </div>
      </main>
    );
  }

  if (error || !character) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageError 
            message={error || 'Personaje no encontrado'}
            onRetry={() => router.push('/')}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navegación superior */}
        <div className="flex items-center justify-between mb-6">
          {/* Breadcrumb y botón back */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition-colors border border-gray-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Regresar</span>
            </button>

            <CharacterNavigation
              characterName={character.name}
              characterId={character.id}
              showBackButton={false}
            />
          </div>

          {/* Navegación entre personajes */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={!navigation.canGoPrev}
              className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-200 rounded-md hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Anterior</span>
            </button>
            
            <span className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-md">
              {character.id} / 826
            </span>
            
            <button
              onClick={handleNext}
              disabled={!navigation.canGoNext}
              className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-200 rounded-md hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <CharacterDetail
          character={character}
          onGenerateAI={handleGenerateAI}
          aiDescription={description}
          isGeneratingAI={isGenerating}
        />

        {/* Enlaces de navegación inferior */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              ¿Quieres explorar más personajes?
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition-colors border border-gray-200"
              >
                Ver todos los personajes
              </button>
              
              {navigation.canGoNext && (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Siguiente personaje →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 