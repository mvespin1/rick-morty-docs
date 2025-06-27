// Componente para mostrar detalle completo del personaje
// Incluirá toda la información disponible y botón de IA 

import { ArrowLeft, MapPin, Calendar, Heart, Users, Zap } from 'lucide-react';
import { TryItOut } from '../common/try-it-out';
import { AIDescription } from './ai-description';
import { cn } from '@/lib/utils';
import type { Character } from '@/types/api';
import type { CharacterDetailProps } from '@/types/character';

export function CharacterDetail({
  character,
  onGenerateAI,
  aiDescription,
  isGeneratingAI = false,
  className
}: CharacterDetailProps) {
  const statusColors = {
    Alive: 'text-green-600 bg-green-50 border-green-200',
    Dead: 'text-red-600 bg-red-50 border-red-200',
    unknown: 'text-gray-600 bg-gray-50 border-gray-200'
  };

  const statusLabels = {
    Alive: 'Vivo',
    Dead: 'Muerto',
    unknown: 'Desconocido'
  };

  const genderLabels = {
    Male: 'Masculino',
    Female: 'Femenino',
    Genderless: 'Sin género',
    unknown: 'Desconocido'
  };

  const requestUrl = `https://rickandmortyapi.com/api/character/${character.id}`;

  return (
    <div className={cn('max-w-4xl mx-auto space-y-6', className)}>
      {/* Header con imagen y datos principales */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="md:flex">
          {/* Imagen */}
          <div className="md:w-1/3">
            <img
              src={character.image}
              alt={character.name}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>

          {/* Información principal */}
          <div className="md:w-2/3 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-mono text-gray-500">#{character.id}</span>
                  <span
                    className={cn(
                      'px-2 py-1 text-xs font-medium rounded-full border',
                      statusColors[character.status]
                    )}
                  >
                    {statusLabels[character.status]}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {character.name}
                </h1>
              </div>
            </div>

            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Especie:</span>
                  <span className="font-medium">{character.species}</span>
                </div>

                {character.type && (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Tipo:</span>
                    <span className="font-medium">{character.type}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Género:</span>
                  <span className="font-medium">{genderLabels[character.gender] || character.gender}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600">Origen:</div>
                    <div className="font-medium">{character.origin.name}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600">Ubicación actual:</div>
                    <div className="font-medium">{character.location.name}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Creado:</span>
                  <span className="font-medium">
                    {new Date(character.created).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Episodios */}
            {character.episode.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Apariciones:</span>
                <span className="font-medium">{character.episode.length} episodios</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Descripción IA */}
      {onGenerateAI && (
        <AIDescription
          character={character}
          description={aiDescription}
          isGenerating={isGeneratingAI}
          onGenerate={onGenerateAI}
        />
      )}

      {/* Try it out */}
      <TryItOut
        title="API Request"
        requestUrl={requestUrl}
        responseData={character}
      />
    </div>
  );
}

// Versión compacta para modales
export function CompactCharacterDetail({
  character,
  onClose,
  className
}: {
  character: Character;
  onClose?: () => void;
  className?: string;
}) {
  const statusColors = {
    Alive: 'text-green-600 bg-green-50',
    Dead: 'text-red-600 bg-red-50',
    unknown: 'text-gray-600 bg-gray-50'
  };

  const statusLabels = {
    Alive: 'Vivo',
    Dead: 'Muerto',
    unknown: 'Desconocido'
  };

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {character.name}
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex gap-4 mb-4">
          <img
            src={character.image}
            alt={character.name}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-500">#{character.id}</span>
              <span
                className={cn(
                  'px-2 py-1 text-xs font-medium rounded-full',
                  statusColors[character.status]
                )}
              >
                {statusLabels[character.status]}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {character.species} • {character.gender}
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-600">Origen:</span>
            <span className="ml-2 font-medium">{character.origin.name}</span>
          </div>
          <div>
            <span className="text-gray-600">Ubicación:</span>
            <span className="ml-2 font-medium">{character.location.name}</span>
          </div>
          <div>
            <span className="text-gray-600">Episodios:</span>
            <span className="ml-2 font-medium">{character.episode.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 