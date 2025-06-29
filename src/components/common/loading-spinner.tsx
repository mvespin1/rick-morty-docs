import { cn } from '@/lib/utils';
import type { LoadingProps } from '@/types/common';

export function LoadingSpinner({ size = 'md', text, className }: LoadingProps & { className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-border/30 border-t-primary glow-subtle',
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse font-medium">
          {text}
        </p>
      )}
    </div>
  );
}

// Componente para toda la página
export function PageLoader({ text = 'Cargando...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[400px] animate-fade-in">
      <div className="text-center space-y-4">
        <div className="p-4 gradient-primary rounded-full w-fit mx-auto glow-subtle">
          <LoadingSpinner size="lg" />
        </div>
        <p className="text-lg font-bold text-gradient">{text}</p>
      </div>
    </div>
  );
}

// Componente para overlays
export function LoadingOverlay({ text = 'Cargando...' }: { text?: string }) {
  return (
    <div className="absolute inset-0 backdrop-dark flex items-center justify-center z-50 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="p-4 gradient-card rounded-full w-fit mx-auto elegant-shadow-lg glow-subtle">
          <LoadingSpinner size="lg" />
        </div>
        <p className="text-lg font-bold text-gradient">{text}</p>
      </div>
    </div>
  );
} 