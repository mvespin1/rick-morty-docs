// Componente para mostrar detalle completo del personaje
// Incluirá toda la información disponible y botón de IA 

import { ArrowLeft, MapPin, Calendar, Heart, Users, Zap, Sparkles, RefreshCw, Code, ExternalLink } from 'lucide-react';
import { TryItOut } from '../common/try-it-out';
import { AIDescription } from './ai-description';
import { Tabs, TabPanel } from '../ui/tabs';
import { cn } from '@/lib/utils';
import type { Character } from '@/types/api';
import type { CharacterDetailProps } from '@/types/character';
import { useState } from 'react';

export function CharacterDetail({
  character,
  onGenerateAI,
  aiDescription,
  isGeneratingAI = false,
  className
}: CharacterDetailProps) {
  const statusColors = {
    Alive: 'text-green-600 bg-green-500/10 border-green-500/20',
    Dead: 'text-red-600 bg-red-500/10 border-red-500/20',
    unknown: 'text-muted-foreground bg-muted/50 border-border'
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
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden elegant-shadow">
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
                  <span className="text-sm font-mono text-muted-foreground bg-muted/30 px-2 py-1 rounded-md">#{character.id}</span>
                  <span
                    className={cn(
                      'px-3 py-1 text-xs font-medium rounded-full border backdrop-blur-sm',
                      statusColors[character.status]
                    )}
                  >
                    {statusLabels[character.status]}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {character.name}
                </h1>
              </div>
            </div>

            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Especie:</span>
                  <span className="font-medium text-foreground">{character.species}</span>
                </div>

                {character.type && (
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Tipo:</span>
                    <span className="font-medium text-foreground">{character.type}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
                  <span className="text-sm text-muted-foreground">Género:</span>
                  <span className="font-medium text-foreground">{genderLabels[character.gender] || character.gender}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/20">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Origen:</div>
                    <div className="font-medium text-foreground">{character.origin.name}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/20">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Ubicación actual:</div>
                    <div className="font-medium text-foreground">{character.location.name}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Creado:</span>
                  <span className="font-medium text-foreground">
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
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <Heart className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Apariciones:</span>
                <span className="font-medium text-foreground">{character.episode.length} episodios</span>
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
  onGenerateAI,
  aiDescription,
  isGeneratingAI = false,
  className
}: {
  character: Character;
  onClose?: () => void;
  onGenerateAI?: () => void;
  aiDescription?: string | null;
  isGeneratingAI?: boolean;
  className?: string;
}) {
  const [activeTab, setActiveTab] = useState('ai');
  
  const statusColors = {
    Alive: 'text-green-600 bg-green-500/10 border-green-500/20',
    Dead: 'text-red-600 bg-red-500/10 border-red-500/20',
    unknown: 'text-muted-foreground bg-muted/50 border-border'
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

  const tabs = [
    {
      id: 'ai',
      label: 'Descripción IA',
      icon: <Sparkles className="w-4 h-4" />
    },
    {
      id: 'api',
      label: 'API Request',
      icon: <Code className="w-4 h-4" />
    }
  ];

  return (
    <div className={cn('gradient-card backdrop-blur-md elegant-border rounded-2xl overflow-hidden elegant-shadow-lg max-w-6xl w-full max-h-[80vh]', className)}>
      {/* Header compacto */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 gradient-primary backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full overflow-hidden elegant-border">
            <img
              src={character.image}
              alt={character.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gradient leading-tight">
              {character.name}
            </h2>
            <span className="text-xs font-mono text-muted-foreground">
              #{character.id}
            </span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-white transition-all p-1 hover:bg-muted/50 rounded-lg interactive-element hover:scale-110 hover:glow-subtle group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
          </button>
        )}
      </div>

      {/* Content principal - Layout ultra optimizado */}
      <div className="p-3 h-[calc(80vh-45px)] overflow-hidden">
        <div className="grid grid-cols-12 gap-3 h-full">
          {/* Columna 1: Imagen y datos básicos (4/12) - SIN SCROLL */}
          <div className="col-span-12 lg:col-span-4 space-y-2 overflow-hidden">
            <div className="w-full max-w-[180px] mx-auto lg:mx-0">
              <img
                src={character.image}
                alt={character.name}
                className="w-full h-auto rounded-lg elegant-shadow-lg hover:glow-subtle transition-all duration-300 hover:scale-105 interactive-element"
              />
            </div>
            
            {/* Status badges ultra compactos */}
            <div className="flex flex-wrap gap-1 justify-center lg:justify-start">
              <span
                className={cn(
                  'px-2 py-0.5 text-xs font-medium rounded-full elegant-border backdrop-blur-sm',
                  statusColors[character.status]
                )}
              >
                {statusLabels[character.status]}
              </span>
              <span className="px-2 py-0.5 text-xs font-medium text-muted-foreground gradient-primary rounded-full elegant-border">
                {character.species}
              </span>
            </div>

            {/* Información básica en grid ultra compacto */}
            <div className="grid grid-cols-1 gap-1.5">
              <div className="p-1.5 rounded-md gradient-card backdrop-blur-sm elegant-border">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Género</div>
                <div className="font-medium text-foreground text-xs">{genderLabels[character.gender]}</div>
              </div>
              
              <div className="p-1.5 rounded-md gradient-card backdrop-blur-sm elegant-border">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Origen</div>
                <div className="font-medium text-foreground text-xs leading-tight">{character.origin.name}</div>
              </div>
              
              <div className="p-1.5 rounded-md gradient-card backdrop-blur-sm elegant-border">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Ubicación</div>
                <div className="font-medium text-foreground text-xs leading-tight">{character.location.name}</div>
              </div>
              
              {character.type && (
                <div className="p-1.5 rounded-md gradient-card backdrop-blur-sm elegant-border">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Tipo</div>
                  <div className="font-medium text-foreground text-xs leading-tight">{character.type}</div>
                </div>
              )}
              
              <div className="p-1.5 rounded-md bg-primary/10 border border-primary/30 backdrop-blur-sm glow-subtle">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Episodios</div>
                <div className="font-medium text-primary text-xs">{character.episode.length} apariciones</div>
              </div>
              
              <div className="p-1.5 rounded-md gradient-card backdrop-blur-sm elegant-border">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Creado</div>
                <div className="font-medium text-foreground text-xs">
                  {new Date(character.created).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Columna 2: Tabs con IA y API (8/12) */}
          <div className="col-span-12 lg:col-span-8 h-full">
            <div className="gradient-card backdrop-blur-sm elegant-border rounded-lg overflow-hidden h-full">
              <Tabs 
                tabs={tabs} 
                defaultTab="ai" 
                onChange={setActiveTab}
                className="h-full"
              >
                {/* Tab Panel: Descripción IA */}
                <TabPanel tabId="ai" activeTab={activeTab} className="h-full">
                  {onGenerateAI && (
                    <div className="h-full flex flex-col">
                      <div className="flex-1 p-3 overflow-y-auto">
                        {isGeneratingAI ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <div className="p-2 bg-primary/10 rounded-full w-fit mx-auto mb-2 glow-subtle">
                                <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                              </div>
                              <p className="text-foreground font-medium text-sm mb-1">
                                Generando descripción para <strong>{character.name}</strong>...
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Esto puede tomar unos segundos
                              </p>
                            </div>
                          </div>
                        ) : aiDescription ? (
                          <div className="space-y-3 h-full">
                            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-3 elegant-border backdrop-blur-sm">
                              <p className="text-foreground leading-relaxed text-sm">
                                {aiDescription}
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Sparkles className="w-3 h-3 text-primary" />
                                <span>Generado por IA</span>
                              </div>
                              <button
                                onClick={onGenerateAI}
                                disabled={isGeneratingAI}
                                className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all duration-200 elegant-shadow interactive-element hover:scale-105"
                              >
                                <RefreshCw className="w-3 h-3" />
                                Regenerar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center h-full flex items-center justify-center">
                            <div>
                              <div className="p-2 gradient-primary rounded-full w-fit mx-auto mb-2 glow-subtle">
                                <Sparkles className="w-6 h-6 text-muted-foreground" />
                              </div>
                              <h4 className="text-sm font-semibold text-gradient mb-2">
                                Descripción inteligente
                              </h4>
                              <p className="text-muted-foreground mb-3 max-w-xs mx-auto text-xs">
                                Genera una descripción única de <strong>{character.name}</strong> usando IA.
                              </p>
                              <button
                                onClick={onGenerateAI}
                                className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 elegant-shadow font-medium mx-auto text-sm interactive-element hover:scale-105 hover:glow-subtle"
                              >
                                <Sparkles className="w-4 h-4" />
                                Generar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </TabPanel>

                {/* Tab Panel: API Request */}
                <TabPanel tabId="api" activeTab={activeTab} className="h-full">
                  <div className="h-full flex flex-col">
                    <div className="flex-1 p-3 overflow-y-auto">
                      <div className="space-y-2.5">
                        {/* URL */}
                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Endpoint</div>
                          <div className="gradient-card rounded-md p-2 font-mono text-xs text-foreground break-all elegant-border">
                            {requestUrl}
                          </div>
                        </div>

                        {/* Method */}
                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Método</div>
                          <span className="inline-block bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs font-mono elegant-border">
                            GET
                          </span>
                        </div>

                        {/* Response preview */}
                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Respuesta JSON</div>
                          <div className="gradient-card rounded-md p-2 max-h-40 overflow-y-auto elegant-border">
                            <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
                              {JSON.stringify(character, null, 2)}
                            </pre>
                          </div>
                        </div>

                        {/* Try button */}
                        <a
                          href={requestUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 elegant-shadow text-xs font-medium w-full justify-center interactive-element hover:scale-105 hover:glow-subtle group"
                        >
                          <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform duration-200" />
                          Probar en nueva pestaña
                        </a>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 