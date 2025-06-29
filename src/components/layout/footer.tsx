'use client';

import Link from 'next/link';
import { Github, ExternalLink, Heart, Code, Database } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-lg">
                  <span className="text-sm font-bold">R&M</span>
                </div>
                <span className="font-semibold text-foreground">Rick & Morty API</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Documentación interactiva para explorar el multiverso de Rick and Morty 
                con potencia de IA generativa.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>API en vivo</span>
                </div>
              </div>
            </div>

            {/* API Resources */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Recursos API</h3>
              <div className="space-y-3 text-sm">
                <Link
                  href="https://rickandmortyapi.com/documentation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Documentación Oficial
                </Link>
                <Link
                  href="https://rickandmortyapi.com/api/character"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Database className="w-4 h-4" />
                  Endpoint de Personajes
                </Link>
                <Link
                  href="https://github.com/afuh/rick-and-morty-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="w-4 h-4" />
                  Código Fuente API
                </Link>
              </div>
            </div>

            {/* Project Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Acerca del Proyecto</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Code className="w-4 h-4" />
                  <span>Next.js 14 + TypeScript</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Heart className="w-4 h-4" />
                  <span>Con IA de Google Gemini</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Proyecto de demostración construido para mostrar integración 
                  de APIs REST con funcionalidades de IA generativa.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>© {currentYear} Rick & Morty API Docs</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-xs">
                Datos proporcionados por{' '}
                <Link
                  href="https://rickandmortyapi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors underline"
                >
                  Rick and Morty API
                </Link>
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 