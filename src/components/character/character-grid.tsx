import { CharacterCard } from './character-card';
import { LoadingSpinner } from '../common/loading-spinner';
import { cn } from '@/lib/utils';
import type { Character } from '@/types/api';
import type { CharacterGridProps } from '@/types/character';

export function CharacterGrid({
  characters,
  isLoading = false,
  onCharacterClick,
  className
}: CharacterGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Cargando personajes..." />
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="text-gray-400 text-6xl mb-4">🤖</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No se encontraron personajes
        </h3>
        <p className="text-gray-600 max-w-md">
          No hay personajes para mostrar en este momento. 
          Intenta recargar la página o ajustar los filtros.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-6', className)}>
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          onClick={onCharacterClick}
          className="h-full"
        />
      ))}
    </div>
  );
}

// Grid responsive con diferentes tamaños
export function ResponsiveCharacterGrid({
  characters,
  isLoading = false,
  onCharacterClick,
  columns = 'auto',
  className
}: CharacterGridProps & {
  columns?: 'auto' | 1 | 2 | 3 | 4 | 5 | 6;
}) {
  const gridClasses = {
    auto: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6'
  };

  return (
    <CharacterGrid
      characters={characters}
      isLoading={isLoading}
      onCharacterClick={onCharacterClick}
      className={cn('grid gap-6', gridClasses[columns], className)}
    />
  );
}