// Componente de búsqueda reutilizable
// Para usar en header y otras secciones 

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
  disabled?: boolean;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar...',
  onClear,
  className,
  disabled = false
}: SearchBarProps) {
  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            disabled && 'opacity-50 cursor-not-allowed',
            'transition-colors duration-200'
          )}
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Variante específica para búsqueda de personajes por ID
export function CharacterSearchBar({
  value,
  onChange,
  onSearch,
  isSearching = false,
  className
}: {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  isSearching?: boolean;
  className?: string;
}) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className={cn('flex gap-2', className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Buscar por ID (1-826)"
          min="1"
          max="826"
          disabled={isSearching}
          className={cn(
            'w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            isSearching && 'opacity-50 cursor-not-allowed',
            'transition-colors duration-200'
          )}
        />
      </div>
      <button
        onClick={onSearch}
        disabled={isSearching || !value}
        className={cn(
          'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
          (isSearching || !value) && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isSearching ? 'Buscando...' : 'Buscar'}
      </button>
    </div>
  );
} 