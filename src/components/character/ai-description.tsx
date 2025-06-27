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
    <div className={cn('bg-white rounded-lg border border-gray-200 overflow-hidden', className)}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-medium text-gray-900">Descripción con IA</h3>
          </div>
          
          <div className="flex items-center gap-2">
            {description && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-700 transition-colors"
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
                'flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                isGenerating
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
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
      <div className="p-4">
        {isGenerating ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-600">
                Generando descripción inteligente para <strong>{character.name}</strong>...
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Esto puede tomar unos segundos
              </p>
            </div>
          </div>
        ) : description ? (
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
              <p className="text-gray-800 leading-relaxed">
                {description}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Sparkles className="w-3 h-3" />
              <span>Generado por IA • Powered by Google Gemini</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Descripción inteligente
            </h4>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              Genera una descripción única y personalizada de <strong>{character.name}</strong> usando 
              inteligencia artificial.
            </p>
            <button
              onClick={onGenerate}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors mx-auto"
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
    <div className={cn('bg-purple-50 rounded-lg p-3 border border-purple-200', className)}>
      <div className="flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3 h-3 text-purple-600 animate-spin" />
              <span className="text-sm text-purple-700">Generando...</span>
            </div>
          ) : description ? (
            <p className="text-sm text-purple-800 leading-relaxed">
              {description}
            </p>
          ) : (
            <div>
              <p className="text-sm text-purple-700 mb-2">
                Generar descripción IA para {character.name}
              </p>
              <button
                onClick={onGenerate}
                className="text-xs text-purple-600 hover:text-purple-700 font-medium"
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
    <div className={cn('bg-gray-50 rounded-lg p-4 border border-gray-200', className)}>
      <div className="text-center">
        <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-600">
          Descripción IA no disponible para {character.name}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Configura la API key de Gemini para habilitar esta funcionalidad
        </p>
      </div>
    </div>
  );
} 