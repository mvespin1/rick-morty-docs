import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ErrorProps } from '@/types/common';

export function ErrorMessage({ 
  message, 
  onRetry, 
  showRetry = true, 
  className 
}: ErrorProps & { className?: string }) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center gap-4 p-6 rounded-lg border border-red-200 bg-red-50',
      className
    )}>
      <div className="flex items-center gap-2 text-red-600">
        <AlertCircle className="w-5 h-5" />
        <span className="font-medium">Error</span>
      </div>
      
      <p className="text-center text-gray-700 max-w-md">
        {message}
      </p>
      
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Intentar nuevamente
        </button>
      )}
    </div>
  );
}

// Componente para errores de página completa
export function PageError({ 
  message = 'Ha ocurrido un error inesperado', 
  onRetry 
}: { 
  message?: string; 
  onRetry?: () => void; 
}) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <ErrorMessage 
        message={message} 
        onRetry={onRetry}
        className="max-w-lg"
      />
    </div>
  );
}

// Componente para errores simples sin acciones
export function SimpleError({ message, className }: { message: string; className?: string }) {
  return (
    <div className={cn(
      'flex items-center gap-2 p-3 rounded-md border border-red-200 bg-red-50 text-red-700',
      className
    )}>
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm">{message}</span>
    </div>
  );
} 