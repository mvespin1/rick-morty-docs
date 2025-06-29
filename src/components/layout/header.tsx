'use client';

// Componente header principal
// Incluirá navegación, logo y búsqueda global 

import Link from 'next/link';
import { Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn(
      'fixed top-4 left-4 right-4 z-50 max-w-6xl mx-auto',
      className
    )}>
      <div className="backdrop-dark rounded-2xl elegant-shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Ícono de casa a la izquierda */}
            <Link 
              href="/" 
              className="flex items-center justify-center group"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl overflow-hidden gradient-card elegant-border group-hover:scale-105 transition-all duration-200 interactive-element">
                <Home className="w-6 h-6 text-foreground group-hover:text-white transition-colors" />
              </div>
            </Link>
            
            {/* Título en el centro */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-xl font-extrabold text-gradient tracking-wide">RICK & MORTY API</h1>
            </div>
            
            {/* Indicador en vivo a la derecha */}
            <div className="flex items-center gap-2 px-3 py-1.5 gradient-primary rounded-full text-xs font-medium text-muted-foreground elegant-border">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse glow-subtle" />
              <span className="text-foreground/80 font-semibold">Live API</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Header simplificado para páginas internas
export function SimpleHeader({ title, className }: { title?: string; className?: string }) {
  return (
    <header className={cn(
      'fixed top-4 left-4 right-4 z-50 max-w-6xl mx-auto',
      className
    )}>
      <div className="backdrop-dark rounded-2xl elegant-shadow">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center justify-center group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden gradient-card elegant-border group-hover:scale-105 transition-all duration-200 interactive-element">
                <Home className="w-5 h-5 text-foreground group-hover:text-white transition-colors" />
              </div>
            </Link>
            
            {title && (
              <h1 className="text-sm font-medium text-muted-foreground px-3 py-1 gradient-primary rounded-full elegant-border">{title}</h1>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 