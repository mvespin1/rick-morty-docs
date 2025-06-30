'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
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
  
  const rawId = params.id;
  let characterId: number;
  
  if (Array.isArray(rawId)) {
    characterId = parseInt(rawId[0], 10);
  } else if (typeof rawId === 'string') {
    characterId = parseInt(rawId, 10);
  } else {
    characterId = NaN;
  }

  const {
    character,
    isLoading,
    error,
    navigation
  } = useCharacterDetail(characterId);

  const {
    description,
    isGenerating,
    generate
  } = useAIDescription(character?.id || null);
  
  // Si el ID no es válido, mostrar error
  if (isNaN(characterId) || characterId < 1 || characterId > 826) {
    return (
      <main className="min-h-screen bg-background pt-20 relative">
        {/* Background Global */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:60px_60px]" />
          <div className="absolute inset-0 flex items-center justify-center opacity-25">
            <Image
              src="/rick-morty-hero.jpg"
              alt="Rick and Morty"
              fill
              className="object-cover object-center scale-110 blur-[0.5px]"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/80" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageError 
            message="ID de personaje inválido"
            onRetry={() => router.push('/')}
          />
        </div>
      </main>
    );
  }

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
      <main className="min-h-screen bg-background pt-20 relative">
        {/* Background Global */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:60px_60px]" />
          <div className="absolute inset-0 flex items-center justify-center opacity-25">
            <Image
              src="/rick-morty-hero.jpg"
              alt="Rick and Morty"
              fill
              className="object-cover object-center scale-110 blur-[0.5px]"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/80" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageLoader text="Cargando información del personaje..." />
        </div>
      </main>
    );
  }

  if (error || !character) {
    return (
      <main className="min-h-screen bg-background pt-20 relative">
        {/* Background Global */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:60px_60px]" />
          <div className="absolute inset-0 flex items-center justify-center opacity-25">
            <Image
              src="/rick-morty-hero.jpg"
              alt="Rick and Morty"
              fill
              className="object-cover object-center scale-110 blur-[0.5px]"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/80" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageError 
            message={error || 'Personaje no encontrado'}
            onRetry={() => router.push('/')}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-20 relative">
      {/* Background Global - Imagen de fondo fija */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:60px_60px]" />
        <div className="absolute inset-0 flex items-center justify-center opacity-25">
          <Image
            src="/rick-morty-hero.jpg"
            alt="Rick and Morty"
            fill
            className="object-cover object-center scale-110 blur-[0.5px]"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/80" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navegación superior */}
        <div className="flex items-center justify-between mb-8">
          {/* Breadcrumb y botón back */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-card/50 rounded-lg transition-all duration-200 border border-border/50 backdrop-blur-sm hover:scale-105"
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
              className="flex items-center gap-1 px-4 py-2 text-sm border border-border/50 rounded-lg hover:bg-card/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm hover:scale-105"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Anterior</span>
            </button>
            
            <span className="px-4 py-2 text-sm text-muted-foreground bg-card/50 border border-border/50 rounded-lg backdrop-blur-sm font-mono">
              {character.id} / 826
            </span>
            
            <button
              onClick={handleNext}
              disabled={!navigation.canGoNext}
              className="flex items-center gap-1 px-4 py-2 text-sm border border-border/50 rounded-lg hover:bg-card/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm hover:scale-105"
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
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              ¿Quieres explorar más personajes?
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-card/50 rounded-lg transition-all duration-200 border border-border/50 backdrop-blur-sm hover:scale-105"
              >
                Ver todos los personajes
              </button>
              
              {navigation.canGoNext && (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105 shadow-sm"
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