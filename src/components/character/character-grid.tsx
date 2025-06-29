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

// Grid innovador con disposición masonry y elementos dinámicos
export function InnovativeCharacterGrid({
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
        <div className="text-6xl mb-4 opacity-50">🤖</div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No se encontraron personajes
        </h3>
        <p className="text-muted-foreground max-w-md">
          No hay personajes para mostrar en este momento. 
          Intenta recargar la página o ajustar los filtros.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* Layout Masonry Innovador */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4 space-y-4">
        {characters.map((character, index) => {
          // Crear patrones dinámicos para diferentes tamaños
          const isLarge = index % 7 === 0; // Cada 7mo elemento es grande
          const isMedium = index % 5 === 0 && !isLarge; // Cada 5to elemento es mediano
          const hasSpecialEffect = index % 11 === 0; // Efectos especiales cada 11
          
          // Rotaciones sutiles aleatorias
          const rotations = ['rotate-1', '-rotate-1', 'rotate-0', '-rotate-0.5', 'rotate-0.5'];
          const rotation = rotations[index % rotations.length];
          
          // Delays de animación escalonados
          const animationDelay = (index * 50) % 400;
          
          return (
            <div
              key={character.id}
              className={cn(
                'break-inside-avoid mb-4 transform transition-all duration-500 hover:scale-105',
                hasSpecialEffect && 'hover:rotate-1',
                rotation
              )}
              style={{ 
                animationDelay: `${animationDelay}ms`,
                transform: `translateY(${Math.sin(index * 0.1) * 2}px)` 
              }}
            >
              <InnovativeCharacterCard
                character={character}
                onClick={onCharacterClick}
                variant={isLarge ? 'large' : isMedium ? 'medium' : 'normal'}
                hasGlow={hasSpecialEffect}
                index={index}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Card innovadora con diferentes variantes
function InnovativeCharacterCard({
  character,
  onClick,
  variant = 'normal',
  hasGlow = false,
  index
}: {
  character: Character;
  onClick?: (character: Character) => void;
  variant?: 'normal' | 'medium' | 'large';
  hasGlow?: boolean;
  index: number;
}) {
  const handleClick = () => onClick?.(character);

  const getStatusColor = (status: Character['status']) => {
    switch (status) {
      case 'Alive':
        return 'bg-green-500';
      case 'Dead':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: Character['status']) => {
    switch (status) {
      case 'Alive': return 'Vivo';
      case 'Dead': return 'Muerto';
      default: return 'Desconocido';
    }
  };

  // Tamaños dinámicos según variante
  const aspectRatios = {
    normal: 'aspect-square',
    medium: 'aspect-[4/5]',
    large: 'aspect-[3/4]'
  };

  // Gradientes dinámicos basados en el ID
  const gradients = [
    'from-purple-500/10 to-pink-500/10',
    'from-blue-500/10 to-cyan-500/10',
    'from-green-500/10 to-emerald-500/10',
    'from-yellow-500/10 to-orange-500/10',
    'from-red-500/10 to-rose-500/10',
    'from-indigo-500/10 to-purple-500/10'
  ];
  const gradient = gradients[character.id % gradients.length];

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500',
        'hover:border-foreground/20 hover:shadow-2xl hover:shadow-black/10',
        hasGlow && 'ring-2 ring-primary/20 shadow-lg shadow-primary/10',
        'animate-fade-in-scale'
      )}
      style={{ animationDelay: `${(index * 100) % 600}ms` }}
    >
      {/* Background gradient sutil */}
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-30', gradient)} />
      
      {/* Imagen */}
      <div className={cn('relative overflow-hidden', aspectRatios[variant])}>
        <img
          src={character.image}
          alt={character.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay con efecto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* ID flotante */}
        <div className="absolute top-3 left-3 bg-black/80 text-white text-xs font-mono px-2 py-1 rounded-full backdrop-blur-sm">
          #{character.id}
        </div>
        
        {/* Status indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <div className={cn('w-2 h-2 rounded-full', getStatusColor(character.status))} />
        </div>

        {/* Info overlay - aparece en hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="text-white">
            <h3 className="font-bold text-lg mb-1 line-clamp-2">{character.name}</h3>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <span>{character.species}</span>
              <span>•</span>
              <span>{getStatusLabel(character.status)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </div>
  );
}

// Grid responsive tradicional (mantener para compatibilidad)
export function ResponsiveCharacterGrid({
  characters,
  isLoading = false,
  onCharacterClick,
  columns = 'auto',
  className,
  variant = 'traditional'
}: CharacterGridProps & {
  columns?: 'auto' | 1 | 2 | 3 | 4 | 5 | 6;
  variant?: 'traditional' | 'innovative';
}) {
  // Si es innovative, usar el nuevo layout
  if (variant === 'innovative') {
    return (
      <InnovativeCharacterGrid
        characters={characters}
        isLoading={isLoading}
        onCharacterClick={onCharacterClick}
        className={className}
      />
    );
  }

  // Layout tradicional
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