'use client';

// Componente para búsqueda de personajes
// Permitirá buscar por ID, nombre, estado, especie, etc. 

import { useState, KeyboardEvent } from 'react';
import { Search, Loader2, Hash, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CharacterSearchProps } from '@/types/character';

export function CharacterSearch({
  onSearch,
  onSearchById,
  isSearching = false,
  className
}: CharacterSearchProps) {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'id'>('name');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (searchType === 'id') {
      const id = parseInt(query.trim());
      if (!isNaN(id) && id > 0) {
        onSearchById(id);
      }
    } else {
      onSearch(query.trim());
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  const toggleSearchType = () => {
    setSearchType(prev => prev === 'name' ? 'id' : 'name');
    setQuery('');
  };

  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Search Type Toggle */}
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={toggleSearchType}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
              searchType === 'name' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            <User className="w-4 h-4" />
            Por nombre
          </button>
          <button
            type="button"
            onClick={toggleSearchType}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
              searchType === 'id' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            <Hash className="w-4 h-4" />
            Por ID
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
            <Input
              type={searchType === 'id' ? 'number' : 'text'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                searchType === 'id' 
                  ? 'Ingresa el ID del personaje (1-826)' 
                  : 'Buscar por nombre del personaje'
              }
              className="pl-10 pr-20 h-12 text-base bg-background border-border focus:border-ring transition-colors"
              disabled={isSearching}
              min={searchType === 'id' ? 1 : undefined}
              max={searchType === 'id' ? 826 : undefined}
            />
            
            {/* Clear Button */}
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-12 p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            {/* Submit Button */}
            <Button
              type="submit"
              size="sm"
              disabled={!query.trim() || isSearching}
              className="absolute right-1 h-10 px-4"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Search Hints */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          {searchType === 'name' ? (
            <>
              <span>Ejemplos:</span>
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent" onClick={() => setQuery('Rick')}>
                Rick
              </Badge>
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent" onClick={() => setQuery('Morty')}>
                Morty
              </Badge>
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent" onClick={() => setQuery('Summer')}>
                Summer
              </Badge>
            </>
          ) : (
            <>
              <span>Rango válido: 1-826</span>
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent" onClick={() => setQuery('1')}>
                #1
              </Badge>
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent" onClick={() => setQuery('2')}>
                #2
              </Badge>
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent" onClick={() => setQuery('100')}>
                #100
              </Badge>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

// Componente simplificado para el header
interface SimpleCharacterSearchProps {
  onSearchById: (id: number) => void;
  isSearching?: boolean;
  className?: string;
}

export function SimpleCharacterSearch({
  onSearchById,
  isSearching = false,
  className
}: SimpleCharacterSearchProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(query.trim());
    if (!isNaN(id) && id > 0 && id <= 826) {
      onSearchById(id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
        <Input
          type="number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por ID..."
          className="pl-10 pr-12 h-9 text-sm bg-background"
          disabled={isSearching}
          min={1}
          max={826}
        />
        <Button
          type="submit"
          size="sm"
          variant="ghost"
          disabled={!query.trim() || isSearching}
          className="absolute right-1 h-7 w-7 p-0"
        >
          {isSearching ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Search className="w-3 h-3" />
          )}
        </Button>
      </div>
    </form>
  );
}

 