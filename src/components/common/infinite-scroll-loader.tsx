// Componente de loading para Infinite Scroll
import { Loader2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfiniteScrollLoaderProps {
  isLoading: boolean;
  hasNextPage: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

export function InfiniteScrollLoader({
  isLoading,
  hasNextPage,
  error,
  onRetry,
  className
}: InfiniteScrollLoaderProps) {
  if (!hasNextPage && !error) {
    return (
      <div className={cn('flex flex-col items-center py-8 text-gray-500', className)}>
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <ChevronDown className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium">Has visto todos los personajes</p>
        <p className="text-xs text-gray-400 mt-1">¡826 personajes explorados!</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('flex flex-col items-center py-8 text-center', className)}>
        <div className="text-red-500 mb-3">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
            <span className="text-xl">⚠️</span>
          </div>
        </div>
        <p className="text-red-600 font-medium mb-2">Error al cargar más personajes</p>
        <p className="text-gray-600 text-sm mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
          >
            Intentar nuevamente
          </button>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn('flex flex-col items-center py-8 text-gray-600', className)}>
        <Loader2 className="w-8 h-8 animate-spin mb-3" />
        <p className="text-sm font-medium">Cargando más personajes...</p>
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
          <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
          <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse delay-75" />
          <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse delay-150" />
        </div>
      </div>
    );
  }

  // Default state (ready to load more)
  return (
    <div className={cn('flex items-center justify-center py-4', className)}>
      <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
    </div>
  );
} 