'use client';

// Componente para búsqueda de personajes
// Permitirá buscar por ID, nombre, estado, especie, etc. 

import { useState, useEffect } from 'react';
import { Search, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CharacterSearchProps } from '@/types/character';

export function CharacterSearch({
  onSearch,
  onSearchById,
  isSearching = false,
  placeholder = 'Buscar personaje...',
  className
}: CharacterSearchProps) {
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'name' | 'id'>('name');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setError(null);
    
    // Auto-detectar si es búsqueda por ID
    const isNumeric = /^\d+$/.test(value);
    if (isNumeric && searchMode === 'name') {
      setSearchMode('id');
    } else if (!isNumeric && searchMode === 'id') {
      setSearchMode('name');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (searchMode === 'id') {
      const id = parseInt(query);
      if (id < 1 || id > 826) {
        setError('El ID debe estar entre 1 y 826');
        return;
      }
      onSearchById(id);
    } else {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    setError(null);
    setSearchMode('name');
  };

  return (
    <div className={cn('space-y-2', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          
          <input
            type={searchMode === 'id' ? 'number' : 'text'}
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={searchMode === 'id' ? 'Buscar por ID (1-826)' : placeholder}
            min={searchMode === 'id' ? 1 : undefined}
            max={searchMode === 'id' ? 826 : undefined}
            disabled={isSearching}
            className={cn(
              'w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              isSearching && 'opacity-50 cursor-not-allowed',
              error && 'border-red-300 focus:ring-red-500',
              'transition-colors duration-200'
            )}
          />

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              disabled={isSearching}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className={cn(
              'absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
              (isSearching || !query.trim()) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isSearching ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>

      {/* Search mode indicator */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span>Buscando por:</span>
          <span className={cn(
            'px-2 py-1 rounded-full font-medium',
            searchMode === 'id' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-gray-100 text-gray-700'
          )}>
            {searchMode === 'id' ? 'ID' : 'Nombre'}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              setSearchMode('name');
              setQuery('');
              setError(null);
            }}
            disabled={isSearching}
            className={cn(
              'hover:text-gray-700 transition-colors',
              searchMode === 'name' && 'text-blue-600 font-medium'
            )}
          >
            Por nombre
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchMode('id');
              setQuery('');
              setError(null);
            }}
            disabled={isSearching}
            className={cn(
              'hover:text-gray-700 transition-colors',
              searchMode === 'id' && 'text-blue-600 font-medium'
            )}
          >
            Por ID
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// Búsqueda simple solo por ID (para header)
export function SimpleCharacterSearch({
  onSearchById,
  isSearching = false,
  className
}: {
  onSearchById: (id: number) => void;
  isSearching?: boolean;
  className?: string;
}) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const id = parseInt(query);
    if (isNaN(id) || id < 1 || id > 826) {
      setError('Ingresa un ID válido (1-826)');
      return;
    }

    setError(null);
    onSearchById(id);
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setError(null);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="number"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="ID del personaje (1-826)"
            min="1"
            max="826"
            disabled={isSearching}
            className={cn(
              'w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              isSearching && 'opacity-50 cursor-not-allowed',
              error && 'border-red-300 focus:ring-red-500',
              'transition-colors duration-200'
            )}
          />
        </div>
        
        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className={cn(
            'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors whitespace-nowrap',
            (isSearching || !query.trim()) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isSearching ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// Búsqueda con auto-complete (versión avanzada)
export function AdvancedCharacterSearch({
  onSearch,
  onSearchById,
  suggestions = [],
  isSearching = false,
  className
}: CharacterSearchProps & {
  suggestions?: string[];
}) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (query && suggestions.length > 0) {
      const filtered = suggestions
        .filter(suggestion => 
          suggestion.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5);
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [query, suggestions]);

  const handleInputChange = (value: string) => {
    setQuery(value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setShowSuggestions(false);
    
    // Detectar si es ID numérico
    const isNumeric = /^\d+$/.test(query.trim());
    if (isNumeric) {
      const id = parseInt(query);
      if (id >= 1 && id <= 826) {
        onSearchById(id);
        return;
      }
    }
    
    onSearch(query.trim());
  };

  return (
    <div className={cn('relative', className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Buscar por nombre o ID..."
            disabled={isSearching}
            className={cn(
              'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              isSearching && 'opacity-50 cursor-not-allowed',
              'transition-colors duration-200'
            )}
          />
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <span className="text-gray-900">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 