// Componente de paginación reutilizable
// Para navegar entre páginas de resultados 

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PaginationProps } from '@/types/common';

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  className
}: PaginationProps & { className?: string }) {
  const pages = generatePagination(currentPage, totalPages);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {showPageNumbers && (
        <p className="text-sm text-gray-600">
          Página {currentPage} de {totalPages}
        </p>
      )}
      
      <nav className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage <= 1}
          className={cn(
            'flex items-center gap-1 px-3 py-2 text-sm rounded-md border transition-colors',
            currentPage <= 1
              ? 'cursor-not-allowed text-gray-400 border-gray-200'
              : 'text-gray-700 border-gray-300 hover:bg-gray-50'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        <div className="flex items-center gap-1">
          {pages.map((page, index) => (
            <PaginationItem
              key={index}
              page={page}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          className={cn(
            'flex items-center gap-1 px-3 py-2 text-sm rounded-md border transition-colors',
            currentPage >= totalPages
              ? 'cursor-not-allowed text-gray-400 border-gray-200'
              : 'text-gray-700 border-gray-300 hover:bg-gray-50'
          )}
        >
          Siguiente
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>
    </div>
  );
}

function PaginationItem({
  page,
  currentPage,
  onPageChange
}: {
  page: number | string;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  if (page === '...') {
    return (
      <span className="flex items-center justify-center w-10 h-10 text-gray-400">
        <MoreHorizontal className="w-4 h-4" />
      </span>
    );
  }

  const pageNumber = page as number;
  const isActive = pageNumber === currentPage;

  return (
    <button
      onClick={() => onPageChange(pageNumber)}
      className={cn(
        'flex items-center justify-center w-10 h-10 text-sm rounded-md border transition-colors',
        isActive
          ? 'bg-blue-600 text-white border-blue-600'
          : 'text-gray-700 border-gray-300 hover:bg-gray-50'
      )}
    >
      {pageNumber}
    </button>
  );
}

// Función helper para generar números de página
function generatePagination(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
} 