'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResponsiveCharacterGrid } from '@/components/character/character-grid';
import { CharacterSearch } from '@/components/character/character-search';
import { LoadingSpinner, PageLoader } from '@/components/common/loading-spinner';
import { ErrorMessage, PageError } from '@/components/common/error-message';
import { InfiniteScrollLoader } from '@/components/common/infinite-scroll-loader';
import { useCharacters } from '@/hooks/use-characters';
import { useCharacterStore } from '@/store/character-store';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { Sparkles, Users, Zap, Search, X } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  
  const {
    characters,
    isLoading,
    error,
    hasNextPage,
    loadMore,
    currentPage,
    totalPages,
    totalCharacters,
    refresh,
    isEmpty
  } = useCharacters();

  const { 
    results: searchResults,
    isSearching,
    selectedId,
    query,
    hasSearched,
    searchByName,
    searchById,
    clearSearch
  } = useCharacterStore();

  // Determinar qué personajes mostrar
  const displayCharacters = hasSearched && searchResults.length > 0 ? searchResults : characters;
  const isShowingSearchResults = hasSearched && (searchResults.length > 0 || query || selectedId);
  const searchType = selectedId ? 'ID' : query ? 'nombre' : null;

  // Manejar clic en personaje
  const handleCharacterClick = (character: any) => {
    router.push(`/character/${character.id}`);
  };

  // Configurar infinite scroll
  const { loadingRef } = useInfiniteScroll({
    hasNextPage,
    isLoading,
    loadMore,
    enabled: !isShowingSearchResults, // Solo activo cuando no hay búsqueda
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
  const handleSearch = async (query: string) => {
    try {
      await searchByName(query);
    } catch (error) {
      console.error('Error en búsqueda por nombre:', error);
    }
  };

  // Limpiar búsqueda y volver a la vista normal
  const handleClearSearch = () => {
    clearSearch();
    setShowSearch(false);
  };

  // Mostrar error si existe
  if (error && !isLoading && characters.length === 0) {
  return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageError 
            message={error}
            onRetry={handleRetry}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header de la página */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Zap className="w-8 h-8 text-green-500" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Rick & Morty
            </h1>
          </div>
          
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Explora el universo de Rick and Morty a través de su API oficial. 
            Descubre personajes, obtén información detallada y genera descripciones únicas con IA.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>826+ Personajes</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>IA Generativa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>API en Tiempo Real</span>
            </div>
          </div>

          {/* Toggle de búsqueda */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Search className="w-4 h-4" />
              {showSearch ? 'Ocultar búsqueda' : 'Buscar personaje'}
            </button>
          </div>
        </div>

        {/* Componente de búsqueda */}
        {showSearch && (
          <div className="mb-8">
            <div className="max-w-2xl mx-auto">
              <CharacterSearch
                onSearch={handleSearch}
                onSearchById={handleSearchById}
                isSearching={isSearching}
                placeholder="Buscar por nombre o ID..."
              />
            </div>
          </div>
        )}

        {/* Indicador de resultado de búsqueda */}
        {isShowingSearchResults && (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700 font-medium">
                    {searchResults.length > 0 ? (
                      `Encontrados ${searchResults.length} resultado(s) para "${searchType === 'ID' ? selectedId : query}"`
                    ) : (
                      `Sin resultados para "${searchType === 'ID' ? selectedId : query}"`
                    )}
                  </span>
                </div>
                <button
                  onClick={handleClearSearch}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <X className="w-3 h-3" />
                  <span>Limpiar</span>
                </button>
              </div>
              {searchResults.length === 0 && hasSearched && !isSearching && (
                <p className="text-blue-600 text-sm mt-2">
                  Intenta con otro {searchType === 'ID' ? 'ID' : 'nombre'} o revisa la escritura.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Estadísticas rápidas */}
        {displayCharacters.length > 0 && !isShowingSearchResults && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">826+</div>
                <div className="text-sm text-gray-600">Total de Personajes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{totalPages}</div>
                <div className="text-sm text-gray-600">Páginas Disponibles</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{totalCharacters}</div>
                <div className="text-sm text-gray-600">Cargados Hasta Ahora</div>
              </div>
            </div>
          </div>
        )}

        {/* Grid de personajes */}
        {(isLoading || isSearching) && displayCharacters.length === 0 ? (
          <PageLoader text={isSearching ? "Buscando personaje..." : "Cargando personajes del universo..."} />
        ) : (
          <div className="space-y-8">
            {/* Grid responsive */}
            <ResponsiveCharacterGrid
              characters={displayCharacters}
              isLoading={(isLoading || isSearching) && displayCharacters.length === 0}
              onCharacterClick={handleCharacterClick}
              columns="auto"
            />

            {/* Infinite Scroll Loader - Solo mostrar si no hay búsqueda activa */}
            {!isShowingSearchResults && (
              <div ref={loadingRef}>
                <InfiniteScrollLoader
                  isLoading={isLoading}
                  hasNextPage={hasNextPage}
                  error={error}
                  onRetry={loadMore}
                />
              </div>
            )}
          </div>
        )}

        {/* Mensaje si no hay personajes */}
        {isEmpty && !error && !isShowingSearchResults && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No hay personajes disponibles
            </h3>
            <p className="text-gray-600 mb-4">
              No se pudieron cargar los personajes en este momento.
            </p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Intentar nuevamente
            </button>
          </div>
        )}

        {/* Footer informativo */}
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>
            Los datos se obtienen en tiempo real desde la{' '}
            <a
              href="https://rickandmortyapi.com"
          target="_blank"
          rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Rick and Morty API
        </a>
          </p>
          <p className="mt-2">
            Haz clic en cualquier personaje para ver más detalles y generar una descripción con IA
          </p>
        </div>
    </div>
    </main>
  );
}
