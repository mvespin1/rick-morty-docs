'use client';

// Componente header principal
// Incluirá navegación, logo y búsqueda global 

import Link from 'next/link';
import { Zap, Github } from 'lucide-react';
import { SimpleCharacterSearch } from '../character/character-search';
import { useSearch } from '@/hooks/use-search';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { searchSpecificId, isSearching } = useSearch();

  const handleSearch = (id: number) => {
    searchSpecificId(id);
  };

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60',
      className
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              <div className="relative">
                <Zap className="w-6 h-6 text-green-500" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              </div>
              <span className="hidden sm:inline">Rick & Morty API</span>
              <span className="sm:hidden">R&M API</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
              <span>Docs</span>
            </div>
          </div>

          {/* Búsqueda central */}
          <div className="flex-1 max-w-md mx-4">
            <SimpleCharacterSearch
              onSearchById={handleSearch}
              isSearching={isSearching}
              className="w-full"
            />
          </div>

          {/* Enlaces de navegación */}
          <nav className="flex items-center gap-4">
            <Link
              href="https://rickandmortyapi.com/documentation"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              API Docs
            </Link>
            
            <Link
              href="https://github.com/afuh/rick-and-morty-api"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </Link>

            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-gray-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-600">API Online</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

// Header simplificado para páginas internas
export function SimpleHeader({ title, className }: { title?: string; className?: string }) {
  return (
    <header className={cn(
      'w-full border-b border-gray-200 bg-white',
      className
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            <Zap className="w-5 h-5 text-green-500" />
            <span>Rick & Morty API</span>
          </Link>
          
          {title && (
            <h1 className="text-lg font-medium text-gray-700">{title}</h1>
          )}
        </div>
      </div>
    </header>
  );
} 