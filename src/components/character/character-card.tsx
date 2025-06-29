// Componente para mostrar tarjeta individual de personaje
// Mostrará imagen, nombre y datos básicos 

'use client';

import { MouseEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Character } from '@/types/api';
import type { CharacterCardProps } from '@/types/character';

export function CharacterCard({
  character,
  onClick,
  className,
  showFullInfo = false
}: CharacterCardProps & { showFullInfo?: boolean }) {
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onClick?.(character);
  };

  const getStatusVariant = (status: Character['status']) => {
    switch (status) {
      case 'Alive':
        return 'default';
      case 'Dead':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: Character['status']) => {
    switch (status) {
      case 'Alive':
        return 'Vivo';
      case 'Dead':
        return 'Muerto';
      default:
        return 'Desconocido';
    }
  };

  const getGenderLabel = (gender: Character['gender']) => {
    switch (gender) {
      case 'Male':
        return 'Masculino';
      case 'Female':
        return 'Femenino';
      default:
        return gender;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group relative bg-card border rounded-lg overflow-hidden transition-all duration-300 hover-lift',
        onClick ? 'cursor-pointer hover:border-foreground/20' : '',
        'animate-fade-in-scale',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={character.image}
          alt={character.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Status Badge - Floating */}
        <div className="absolute top-3 right-3">
          <Badge variant={getStatusVariant(character.status)} className="text-xs font-medium backdrop-blur-sm">
            {getStatusLabel(character.status)}
          </Badge>
        </div>

        {/* ID Badge - Minimal */}
        <div className="absolute top-3 left-3 bg-black/80 text-white text-xs font-mono px-2 py-1 rounded-md">
          #{character.id}
        </div>

        {/* Overlay on hover */}
        {onClick && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Name */}
        <div>
          <h3 className="font-semibold text-foreground group-hover:text-foreground/80 transition-colors line-clamp-2">
            {character.name}
          </h3>
        </div>

        {/* Basic Info */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wide font-medium">Especie</span>
            <span className="font-medium text-foreground">{character.species}</span>
          </div>
          
          {character.type && (
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide font-medium">Tipo</span>
              <span className="font-medium text-foreground truncate ml-2">{character.type}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wide font-medium">Género</span>
            <span className="font-medium text-foreground">{getGenderLabel(character.gender)}</span>
          </div>
        </div>

        {/* Extended Info */}
        {showFullInfo && (
          <div className="pt-3 border-t space-y-2 text-sm">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide font-medium text-muted-foreground">Origen</span>
                <span className="font-medium text-foreground text-right ml-2 line-clamp-1">{character.origin.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide font-medium text-muted-foreground">Ubicación</span>
                <span className="font-medium text-foreground text-right ml-2 line-clamp-1">{character.location.name}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs uppercase tracking-wide font-medium text-muted-foreground">Episodios</span>
              <Badge variant="outline" className="text-xs">
                {character.episode.length}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Variante compacta para listas
export function CompactCharacterCard({
  character,
  onClick,
  className
}: {
  character: Character;
  onClick?: (id: number) => void;
  className?: string;
}) {
  const handleClick = () => onClick?.(character.id);

  const getStatusVariant = (status: Character['status']) => {
    switch (status) {
      case 'Alive':
        return 'default';
      case 'Dead':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: Character['status']) => {
    switch (status) {
      case 'Alive':
        return 'Vivo';
      case 'Dead':
        return 'Muerto';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex items-center gap-4 p-4 bg-card border rounded-lg transition-all duration-200 hover-lift',
        onClick && 'cursor-pointer hover:border-foreground/20',
        className
      )}
    >
      <div className="relative">
        <img
          src={character.image}
          alt={character.name}
          className="w-16 h-16 rounded-full object-cover ring-2 ring-border"
        />
        <div className="absolute -bottom-1 -right-1">
          <Badge variant={getStatusVariant(character.status)} className="text-xs px-1 py-0">
            {getStatusLabel(character.status)}
          </Badge>
        </div>
      </div>
      
      <div className="flex-1 min-w-0 space-y-1">
        <h4 className="font-semibold text-foreground truncate">{character.name}</h4>
        <p className="text-sm text-muted-foreground">{character.species}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>#{character.id}</span>
          <span>•</span>
          <span>{character.episode.length} episodios</span>
        </div>
      </div>
    </div>
  );
} 