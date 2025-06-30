import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface NavigationProps {
  breadcrumbs?: BreadcrumbItem[];
  showBackButton?: boolean;
  className?: string;
}

export function Navigation({ breadcrumbs, showBackButton = false, className }: NavigationProps) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <nav className={cn('flex items-center gap-4 py-3', className)}>
      {/* Botón de regreso */}
      {showBackButton && (
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Regresar</span>
        </button>
      )}

      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <ol className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
              
              {item.current ? (
                <span className="font-medium text-gray-900">
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-600">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}

// Navegación específica para páginas de personajes
export function CharacterNavigation({
  characterName,
  characterId,
  showBackButton = true,
  className
}: {
  characterName?: string;
  characterId?: number;
  showBackButton?: boolean;
  className?: string;
}) {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', href: '/' },
    { label: 'Personajes', href: '/' },
  ];

  if (characterName && characterId) {
    breadcrumbs.push({
      label: `${characterName} (#${characterId})`,
      current: true
    });
  }

  return (
    <Navigation
      breadcrumbs={breadcrumbs}
      showBackButton={showBackButton}
      className={className}
    />
  );
}

// Navegación con indicadores de página
export function PageNavigation({
  currentPage,
  totalPages,
  onPageChange,
  showInfo = true,
  className
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {showInfo && (
        <div className="text-sm text-gray-600">
          Página {currentPage} de {totalPages}
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={cn(
            'px-3 py-1.5 text-sm border rounded-md transition-colors',
            currentPage <= 1
              ? 'cursor-not-allowed text-gray-400 border-gray-200'
              : 'text-gray-700 border-gray-300 hover:bg-gray-50'
          )}
        >
          Anterior
        </button>
        
        <span className="px-3 py-1.5 text-sm font-medium">
          {currentPage}
        </span>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={cn(
            'px-3 py-1.5 text-sm border rounded-md transition-colors',
            currentPage >= totalPages
              ? 'cursor-not-allowed text-gray-400 border-gray-200'
              : 'text-gray-700 border-gray-300 hover:bg-gray-50'
          )}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

// Mini navegación para componentes internos
export function MiniNavigation({ 
  items,
  current,
  className 
}: { 
  items: { label: string; value: string; count?: number }[];
  current: string;
  className?: string;
}) {
  return (
    <nav className={cn('flex items-center gap-1 p-1 bg-gray-100 rounded-lg', className)}>
      {items.map((item) => (
        <button
          key={item.value}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
            current === item.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
          )}
        >
          {item.label}
          {item.count !== undefined && (
            <span className="ml-2 text-xs text-gray-500">
              ({item.count})
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}

// Hook personalizado para generar breadcrumbs automáticamente
export function useBreadcrumbs() {
  // Esta función podría expandirse para generar breadcrumbs basados en la ruta actual
  const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Inicio', href: '/' }
    ];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      // Personalizar labels según el segmento
      let label = segment;
      if (segment === 'character') {
        label = 'Personajes';
      } else if (segment.match(/^\d+$/)) {
        label = `#${segment}`;
      }

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        current: isLast
      });
    });

    return breadcrumbs;
  };

  return { generateBreadcrumbs };
} 