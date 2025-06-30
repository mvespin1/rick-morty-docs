"use client";

import { useState } from "react";
import { ResponsiveCharacterGrid } from "@/components/character/character-grid";
import { CharacterSearch } from "@/components/character/character-search";
import { CharacterModal } from "@/components/character/character-modal";
import { PageError } from "@/components/common/error-message";
import { InfiniteScrollLoader } from "@/components/common/infinite-scroll-loader";
import { useCharacters } from "@/hooks/use-characters";
import { useCharacterStore } from "@/store/character-store";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useCharacterModal } from "@/hooks/use-character-modal";
import { Search, ArrowRight } from "lucide-react";
import Image from "next/image";
import type { Character } from "@/types/api";

export default function HomePage() {
  const [showSearch, setShowSearch] = useState(false);

  const {
    characters,
    isLoading,
    error,
    hasNextPage,
    loadMore,
    refresh,
  } = useCharacters();

  const {
    results: searchResults,
    isSearching,
    selectedId,
    query,
    hasSearched,
    searchByName,
    searchById,
    clearSearch,
  } = useCharacterStore();

  // Configurar modal de personaje
  const {
    isOpen: isModalOpen,
    selectedCharacter: modalCharacter,
    isLoadingDetail,
    openModal,
    closeModal,
    aiDescription: modalAiDescription,
    isGeneratingAI: modalIsGeneratingAI,
    handleGenerateAI: modalHandleGenerateAI,
    navigateToCharacter,
    canNavigateNext,
    canNavigatePrev,
  } = useCharacterModal();

  // Determinar qué personajes mostrar
  const displayCharacters =
    hasSearched && searchResults.length > 0 ? searchResults : characters;
  const isShowingSearchResults =
    hasSearched && (searchResults.length > 0 || query || selectedId);
  const searchType = selectedId ? "ID" : query ? "nombre" : null;

  // Manejar clic en personaje - Abrir modal
  const handleCharacterClick = (character: Character) => {
    openModal(character);
  };

  // Configurar infinite scroll
  const { loadingRef } = useInfiniteScroll({
    hasNextPage,
    isLoading,
    loadMore,
    enabled: !isShowingSearchResults,
  });

  // Manejar retry en caso de error
  const handleRetry = () => {
    refresh();
  };

  // Manejar búsqueda por ID
  const handleSearchById = async (id: number) => {
    await searchById(id);
  };

  // Manejar búsqueda por nombre
  const handleSearch = async (searchQuery: string) => {
    try {
      await searchByName(searchQuery);
    } catch {
      // Error ya manejado en el store
    }
  };

  // Limpiar búsqueda y volver a la vista normal
  const handleClearSearch = () => {
    clearSearch();
    setShowSearch(false);
  };

  // Funciones de navegación en modal
  const handleNavigateNext = () => {
    if (modalCharacter && modalCharacter.id < 826) {
      navigateToCharacter(modalCharacter.id + 1);
    }
  };

  const handleNavigatePrev = () => {
    if (modalCharacter && modalCharacter.id > 1) {
      navigateToCharacter(modalCharacter.id - 1);
    }
  };

  // Mostrar error si existe
  if (error && !isLoading && characters.length === 0) {
  return (
      <main className="min-h-screen bg-background pt-20 relative">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:60px_60px]" />
          <div className="absolute inset-0 flex items-center justify-center opacity-25">
            <Image
              src="/rick-morty-hero.jpg"
              alt="Rick and Morty"
              width={1920}
              height={1080}
              className="w-full h-full object-cover object-center scale-110 blur-[0.5px]"
              priority={false}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/80" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <PageError message={error} onRetry={handleRetry} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-20 relative">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:60px_60px]" />
        <div className="absolute inset-0 flex items-center justify-center opacity-25">
          <Image
            src="/rick-morty-hero.jpg"
            alt="Rick and Morty"
            width={1920}
            height={1080}
            className="w-full h-full object-cover object-center scale-110 blur-[0.5px]"
            priority={false}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/80" />
      </div>

      <section className="relative z-10 overflow-hidden">
        <div className="relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="text-center space-y-6">
              <div className="space-y-3">
                <div className="flex justify-center mb-6">
                  <div className="w-60 h-30 sm:w-72 sm:h-36 lg:w-80 lg:h-40 backdrop-dark rounded-3xl p-4 elegant-shadow-lg hover:glow-primary transition-all duration-300 hover:scale-105 animate-fade-in-scale group">
                    <Image
                      src="/rick-morty-logo.svg"
                      alt="Rick & Morty Logo"
                      width={320}
                      height={160}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                      priority
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-primary-foreground bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Explorar Personajes
                </button>
                <a
                  href="https://rickandmortyapi.com/documentation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 border border-border text-sm font-medium rounded-lg text-foreground bg-background/50 backdrop-blur-sm hover:bg-accent transition-all duration-200 hover:scale-105"
                >
                  Ver Documentación
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {showSearch && (
          <div className="mb-8 animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <div className="bg-card/80 backdrop-blur-md border border-border/50 rounded-lg p-4 elegant-shadow">
                <CharacterSearch
                  onSearch={handleSearch}
                  onSearchById={handleSearchById}
                  isSearching={isSearching}
                />
              </div>
            </div>
          </div>
        )}

        {isShowingSearchResults && (
          <div className="mb-6 animate-fade-in">
            <div className="bg-muted/80 backdrop-blur-md border border-border/50 rounded-lg p-3 max-w-2xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {searchResults.length > 0
                      ? `${searchResults.length} resultado(s) para "${
                          searchType === "ID" ? selectedId : query
                        }"`
                      : `Sin resultados para "${
                          searchType === "ID" ? selectedId : query
                        }"`}
                  </span>
                </div>
                <button
                  onClick={handleClearSearch}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Limpiar búsqueda
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <ResponsiveCharacterGrid
            characters={displayCharacters}
            isLoading={isLoading && characters.length === 0}
            onCharacterClick={handleCharacterClick}
            className="mb-8"
            variant="innovative"
          />
        </div>

        {hasNextPage && !isShowingSearchResults && (
          <div ref={loadingRef} className="flex justify-center py-6">
            <InfiniteScrollLoader
              isLoading={isLoading}
              hasNextPage={hasNextPage}
            />
          </div>
        )}

        {isShowingSearchResults &&
          searchResults.length === 0 &&
          !isSearching && (
            <div className="text-center py-12">
              <div className="mx-auto h-20 w-20 rounded-full bg-muted/80 backdrop-blur-sm flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Sin resultados</h3>
              <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
                No encontramos personajes que coincidan con tu búsqueda. Intenta
                con otros términos.
              </p>
              <button
                onClick={handleClearSearch}
                className="inline-flex items-center px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
              >
                Ver todos los personajes
              </button>
            </div>
          )}
      </div>

      <CharacterModal
        isOpen={isModalOpen}
        character={modalCharacter}
        onClose={closeModal}
        isLoading={isLoadingDetail}
        aiDescription={modalAiDescription}
        isGeneratingAI={modalIsGeneratingAI}
        onGenerateAI={modalHandleGenerateAI}
        onNavigateNext={handleNavigateNext}
        onNavigatePrev={handleNavigatePrev}
        canNavigateNext={canNavigateNext}
        canNavigatePrev={canNavigatePrev}
      />
    </main>
  );
}
