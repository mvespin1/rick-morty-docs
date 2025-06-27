'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ResponsiveCharacterGrid } from '@/components/character/character-grid';
import { Pagination } from '@/components/common/pagination';
import { LoadingSpinner, PageLoader } from '@/components/common/loading-spinner';
import { ErrorMessage, PageError } from '@/components/common/error-message';
import { useCharacters } from '@/hooks/use-characters';
import { Sparkles, Users, Zap } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const {
    characters,
    isLoading,
    error,
    pagination,
    refresh,
    isEmpty
  } = useCharacters();

  // Manejar clic en personaje
  const handleCharacterClick = (character: any) => {
    router.push(`/character/${character.id}`);
  };

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    pagination.goToPage(page);
  };

  // Manejar retry en caso de error
  const handleRetry = () => {
    refresh();
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
        <div className="text-center mb-12">
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

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
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
        </div>

        {/* Estadísticas rápidas */}
        {characters.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">826+</div>
                <div className="text-sm text-gray-600">Total de Personajes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{pagination.totalPages}</div>
                <div className="text-sm text-gray-600">Páginas Disponibles</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{characters.length}</div>
                <div className="text-sm text-gray-600">Mostrando Ahora</div>
              </div>
            </div>
          </div>
        )}

        {/* Grid de personajes */}
        {isLoading && characters.length === 0 ? (
          <PageLoader text="Cargando personajes del universo..." />
        ) : (
          <div className="space-y-8">
            {/* Indicador de carga para paginación */}
            {isLoading && characters.length > 0 && (
              <div className="flex justify-center">
                <LoadingSpinner text="Cargando más personajes..." />
              </div>
            )}
            
            {/* Grid responsive */}
            <ResponsiveCharacterGrid
              characters={characters}
              isLoading={isLoading && characters.length === 0}
              onCharacterClick={handleCharacterClick}
              columns="auto"
            />

            {/* Paginación */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  showPageNumbers={true}
                />
              </div>
            )}
          </div>
        )}

        {/* Mensaje si no hay personajes */}
        {isEmpty && !error && (
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
