// Componente para mostrar tarjeta individual de personaje
// Mostrará imagen, nombre y datos básicos 

import { MouseEvent } from 'react';
import { MapPin, Calendar, Heart } from 'lucide-react';
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

  const statusColors = {
    Alive: 'bg-green-500',
    Dead: 'bg-red-500',
    unknown: 'bg-gray-500'
  };

  const statusLabels = {
    Alive: 'Vivo',
    Dead: 'Muerto',
    unknown: 'Desconocido'
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group relative bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200',
        onClick ? 'cursor-pointer hover:shadow-lg hover:border-blue-300 hover:-translate-y-1' : '',
        className
      )}
    >
      {/* Image Section */}
      <div className="relative">
        <img
          src={character.image}
          alt={character.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
          <div className={cn('w-2 h-2 rounded-full', statusColors[character.status])} />
          <span className="text-xs font-medium text-gray-700">
            {statusLabels[character.status]}
          </span>
        </div>

        {/* ID Badge */}
        <div className="absolute top-3 left-3 bg-black/70 text-white text-xs font-mono px-2 py-1 rounded">
          #{character.id}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Name */}
        <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
          {character.name}
        </h3>

        {/* Basic Info */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-medium">Especie:</span>
            <span>{character.species}</span>
          </div>
          
          {character.type && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Tipo:</span>
              <span className="truncate">{character.type}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="font-medium">Género:</span>
            <span>{character.gender === 'Male' ? 'Masculino' : character.gender === 'Female' ? 'Femenino' : character.gender}</span>
          </div>
        </div>

        {/* Extended Info */}
        {showFullInfo && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <div><span className="font-medium">Origen:</span> {character.origin.name}</div>
                <div><span className="font-medium">Ubicación:</span> {character.location.name}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">Creado:</span>
              <span>{new Date(character.created).toLocaleDateString('es-ES')}</span>
            </div>

            {character.episode.length > 0 && (
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">Episodios:</span>
                <span>{character.episode.length}</span>
              </div>
            )}
          </div>
        )}

        {/* Hover Effect */}
        {onClick ? (
          <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
        ) : null}
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

  const statusColors = {
    Alive: 'bg-green-500',
    Dead: 'bg-red-500',
    unknown: 'bg-gray-500'
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-md hover:border-blue-300',
        className
      )}
    >
      <img
        src={character.image}
        alt={character.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{character.name}</h4>
        <p className="text-sm text-gray-600">{character.species}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className={cn('w-2 h-2 rounded-full', statusColors[character.status])} />
        <span className="text-xs text-gray-500">#{character.id}</span>
      </div>
    </div>
  );
} 