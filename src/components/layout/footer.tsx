import Link from 'next/link';
import { Heart, ExternalLink, Code, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn(
      'border-t border-gray-200 bg-gray-50/50 backdrop-blur-sm',
      className
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Información principal */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-gray-900">Rick & Morty API Docs</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Documentación interactiva de la API de Rick and Morty con integración 
              de IA generativa para descripciones de personajes.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Hecho con</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>para Kushki</span>
            </div>
          </div>

          {/* Enlaces útiles */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://rickandmortyapi.com/documentation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Documentación oficial
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/afuh/rick-and-morty-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Code className="w-3 h-3" />
                  Código fuente API
                </Link>
              </li>
              <li>
                <Link
                  href="https://ai.google.dev/gemini-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Google Gemini API
                </Link>
              </li>
              <li>
                <Link
                  href="https://nextjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Next.js
                </Link>
              </li>
            </ul>
          </div>

          {/* Información técnica */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Tecnologías</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>Next.js 15</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                <span>TypeScript</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                <span>Tailwind CSS</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span>Zustand</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>Gemini AI</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Axios</span>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              © 2024 Rick & Morty API Docs. Prueba técnica para Kushki.
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>API Status:</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-600 font-medium">Operativo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Footer compacto para páginas internas
export function CompactFooter({ className }: { className?: string }) {
  return (
    <footer className={cn(
      'border-t border-gray-200 bg-white',
      className
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="text-sm text-gray-500">
            © 2024 Rick & Morty API Docs
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Powered by</span>
            <Link
              href="https://rickandmortyapi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-blue-600 transition-colors"
            >
              Rick and Morty API
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 