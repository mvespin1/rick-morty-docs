// Componente para generar descripción con IA
// Incluirá botón de generar y área para mostrar resultado 

import { useState } from 'react';
import { Sparkles, RefreshCw, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Character } from '@/types/api';
import type { AIDescriptionProps } from '@/types/character';

export function AIDescription({
  character,
  description,
  isGenerating = false,
  onGenerate,
  className
}: AIDescriptionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!description) return;
    
    try {
      await navigator.clipboard.writeText(description);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying description:', err);
    }
  };

  return (
    <div className={cn('bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden elegant-shadow', className)}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b border-border/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Descripción con IA</h3>
          </div>
          
          <div className="flex items-center gap-3">
            {description && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted/50"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copiar
                  </>
                )}
              </button>
            )}
            
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                isGenerating
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 shadow-sm'
              )}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {description ? 'Regenerar' : 'Generar resumen'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isGenerating ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              </div>
              <p className="text-foreground font-medium mb-2">
                Generando descripción inteligente para <strong>{character.name}</strong>...
              </p>
              <p className="text-sm text-muted-foreground">
                Esto puede tomar unos segundos
              </p>
            </div>
          </div>
        ) : description ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-5 border border-primary/20 backdrop-blur-sm">
              <p className="text-foreground leading-relaxed">
                {description}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-3 h-3" />
              <span>Generado por IA • Powered by Google Gemini</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="p-4 bg-muted/30 rounded-full w-fit mx-auto mb-4">
              <Sparkles className="w-12 h-12 text-muted-foreground" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">
              Descripción inteligente
            </h4>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Genera una descripción única y personalizada de <strong>{character.name}</strong> usando 
              inteligencia artificial.
            </p>
            <button
              onClick={onGenerate}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105 shadow-sm mx-auto"
            >
              <Sparkles className="w-4 h-4" />
              Generar con IA
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Versión compacta para listas
export function CompactAIDescription({
  character,
  description,
  isGenerating = false,
  onGenerate,
  className
}: AIDescriptionProps & { className?: string }) {
  return (
    <div className={cn('bg-primary/5 backdrop-blur-sm rounded-xl p-4 border border-primary/20', className)}>
      <div className="flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3 h-3 text-primary animate-spin" />
              <span className="text-sm text-primary font-medium">Generando...</span>
            </div>
          ) : description ? (
            <p className="text-sm text-foreground leading-relaxed">
              {description}
            </p>
          ) : (
            <div>
              <p className="text-sm text-foreground mb-2">
                Generar descripción IA para {character.name}
              </p>
              <button
                onClick={onGenerate}
                className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Generar →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Placeholder para cuando la IA no está disponible
export function AIDescriptionPlaceholder({
  character,
  className
}: {
  character: Character;
  className?: string;
}) {
  return (
    <div className={cn('bg-muted/30 backdrop-blur-sm rounded-xl p-4 border border-border/50', className)}>
      <div className="text-center">
        <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-foreground mb-1">
          Descripción IA no disponible para {character.name}
        </p>
        <p className="text-xs text-muted-foreground">
          Configura la API key de Gemini para habilitar esta funcionalidad
        </p>
      </div>
    </div>
  );
} 