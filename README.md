# 🧪 Rick & Morty API - Documentación Interactiva
**Autor: Marco Vinicio Espín Tinillo**

Una aplicación moderna de documentación interactiva para la API de Rick and Morty con integración de IA generativa usando Google Gemini. Desarrollada como prueba técnica para demostrar capacidades en desarrollo web moderno, arquitectura escalable y creatividad en UX/UI.

## Demo
- **Link**: https://rick-morty-docs.vercel.app

## Características Principales

### Funcionalidades
- **Exploración de Personajes**: Grid responsivo con los primeros 20 personajes
- **Vista de Detalle**: Información completa de cada personaje con navegación
- **Búsqueda por ID y por Nombre**: Campo de búsqueda en la navegación
- **Try It Out**: Visualización de respuestas JSON reales de la API
- **Generación de Descripciones IA**: Integración completa con Google Gemini

### Experiencia de Usuario
- **Infinite Scroll**: Carga progresiva de personajes
- **Modal Navigation**: Navegación fluida entre personajes sin recargar página
- **Tema Oscuro**: Diseño moderno basado en la estética de Rick & Morty
- **Responsive Design**: Optimizado para móvil y desktop
- **Error Handling**: Manejo elegante de errores 404 y de conexión

### IA Generativa
- **Descripciones Personalizadas**: Cada personaje obtiene descripciones únicas
- **Prompts Optimizados**: Diferentes niveles de detalle según importancia del personaje
- **Fallbacks Inteligentes**: Descripciones específicas para personajes principales
- **Error Handling**: Funcionamiento garantizado con o sin API key

## Decisiones Arquitectónicas

### Framework Principal: **Next.js 14**
**¿Por qué Next.js 14?**
- **App Router**: Nueva arquitectura que mejora performance y DX
- **React Server Components**: Rendimiento optimizado por defecto
- **Optimizaciones Built-in**: Image optimization, font loading, bundling automático
- **Deployment Ready**: Integración con Vercel

### Stack Tecnológico
```json
{
  "framework": "Next.js 14",
  "language": "TypeScript",
  "styling": "Tailwind CSS + Shadcn/ui",
  "state_management": "Zustand",
  "http_client": "Axios",
  "ai_integration": "Google Gemini API",
  "icons": "Lucide React",
  "fonts": "Poppins + JetBrains Mono"
}
```

### Arquitectura Modular
```
src/
├── app/                      # Next.js App Router
├── components/               # Componentes reutilizables
│   ├── ui/                  # Componentes base (Shadcn/ui)
│   ├── character/           # Módulo de personajes
│   ├── common/              # Componentes compartidos
│   └── layout/              # Layout y navegación
├── hooks/                   # Custom hooks
├── services/                # Lógica de API y servicios
├── store/                   # Estado global (Zustand)
├── types/                   # Definiciones TypeScript
└── lib/                     # Utilidades y constantes
```

**Justificación de la Arquitectura:**
1. **Separación de Responsabilidades**: Cada carpeta tiene un propósito específico
2. **Escalabilidad**: Fácil agregar nuevos módulos (episodes, locations)
3. **Mantenibilidad**: Código organizado por dominio, no por tipo de archivo
4. **Reutilización**: Componentes y hooks reutilizables
5. **Type Safety**: TypeScript en toda la aplicación

### Estado Global: **Zustand**
**¿Por qué Zustand sobre Redux?**
- **Simplicidad**: Menos boilerplate, API más intuitiva
- **Performance**: Re-renders optimizados automáticamente
- **TypeScript**: Excelente inferencia de tipos
- **Bundle Size**: Significativamente más liviano que Redux Toolkit

## Estrategias de Rendimiento

### 1. Lazy Loading y Partial Hydration
**Implementaciones Actuales:**
```typescript
// Lazy loading de imágenes con Next.js Image
<Image 
  src={character.image}
  alt={character.name}
  priority={false}        // Solo true para above-the-fold
  placeholder="blur"      // Mejora perceived performance
/>

// Lazy loading de componentes pesados
const CharacterModal = dynamic(() => import('./character-modal'), {
  loading: () => <LoadingSpinner />,
  ssr: false  
});
```

**Para Escalar a Tráfico Masivo:**
- **Infinite Scroll**: Ya implementado, carga solo 20 personajes inicialmente
- **Component Code Splitting**: Modales y componentes pesados cargados on-demand
- **Image Optimization**: Next.js optimiza automáticamente imágenes

### 2. Server-Side Rendering (SSR) y Static Generation (SSG)
**Estrategia Implementada:**
```typescript
// Página principal - Cliente-side data fetching para datos dinámicos
export default function HomePage() {
  // Los datos de Rick & Morty API cambian dinámicamente
}

// Para páginas de detalle podríamos usar SSG con ISR:
export async function generateStaticParams() {
  // Pre-generar páginas de personajes principales (1-20)
  return Array.from({length: 20}, (_, i) => ({ id: String(i + 1) }));
}
```

**Para Tráfico Masivo:**
- **ISR (Incremental Static Regeneration)**: Re-generar páginas cada 24h
- **Edge Caching**: Usar Vercel Edge Network o CloudFlare
- **API Route Caching**: Cache de respuestas de Rick & Morty API

## 🔧 Guía de Implementación

### Prerrequisitos
```bash
Node.js >= 18.0.0
npm >= 8.0.0
```

### Instalación
```bash
# 1. Clonar el repositorio
git clone https://github.com/mvespin1/rick-morty-docs.git
cd rick-morty-docs

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tu API key de Gemini
```

### Configuración de Google Gemini API
1. **Obtener API Key:**
   - Visita [Google AI Studio](https://ai.google.dev/)
   - Crea una cuenta o inicia sesión
   - Genera una nueva API key

2. **Configurar .env.local:**
```bash
# Crear archivo .env.local en la raíz del proyecto
NEXT_PUBLIC_GEMINI_API_KEY=tu_api_key_aqui
```

### Ejecutar el Proyecto
```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## Funcionalidades de la IA

### Prompts Inteligentes
La aplicación usa diferentes estrategias según el tipo de personaje:

**Personajes Principales (IDs 1-5):**
```typescript
// Prompt súper detallado con información específica obligatoria
"Este es RICK SANCHEZ - usa TODO tu conocimiento específico.
Incluye: genialidad, alcoholismo, nihilismo, inventos, 
episodios como 'Pickle Rick', relación con Morty..."
```

**Personajes Secundarios:**
```typescript
// Prompt personalizado pero general
"Usa tu conocimiento específico sobre [NOMBRE].
Episodios donde aparece, relación con personajes principales,
características distintivas..."
```

**Fallbacks Creativos:**
- Rick Sanchez: "El genio científico más brillante del multiverso, alcohólico nihilista..."
- Morty Smith: "Un adolescente de 14 años lleno de ansiedad que sirve como brújula moral..."
- Summer Smith: "De 17 años, más inteligente de lo que aparenta..."

## 🎨 Sistema de Diseño

### Tipografía
- **Primary**: Poppins (300-900) - Moderna y legible
- **Monospace**: JetBrains Mono - Para código JSON

## 🚀 Deployment

### Vercel
```bash
# 1. Conectar repositorio con Vercel
# 2. Configurar variables de entorno en dashboard
# 3. Deploy automático en cada push
```

### Variables de Entorno en Producción
```bash
NEXT_PUBLIC_GEMINI_API_KEY=tu_api_key_real
```

## Estructura del Proyecto

```
rick-morty-docs/
├── public/                   # Assets estáticos
│   ├── rick-morty-hero.jpg  # Imagen de fondo
│   └── rick-morty-logo.svg  # Logo principal
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── character/[id]/  # Páginas dinámicas de detalle
│   │   ├── layout.tsx       # Layout global
│   │   ├── page.tsx         # Página principal
│   │   └── globals.css      # Estilos globales
│   ├── components/
│   │   ├── ui/              # Componentes base Shadcn
│   │   ├── character/       # Módulo de personajes
│   │   │   ├── character-card.tsx
│   │   │   ├── character-grid.tsx
│   │   │   ├── character-detail.tsx
│   │   │   ├── character-modal.tsx
│   │   │   └── character-search.tsx
│   │   ├── common/          # Componentes reutilizables
│   │   └── layout/          # Header, footer, navigation
│   ├── hooks/               # Custom hooks
│   │   ├── use-characters.ts
│   │   ├── use-character-detail.ts
│   │   ├── use-character-modal.ts
│   │   ├── use-ai-description.ts
│   │   ├── use-debounce.ts
│   │   ├── use-infinite-scroll.ts
│   │   └── use-search.ts
│   ├── services/            # Lógica de API
│   │   ├── api.ts           # Cliente HTTP base
│   │   ├── character-api.ts # API Rick & Morty
│   │   ├── gemini-api.ts    # API Google Gemini
│   │   └── utils.ts         # Utilidades de API
│   ├── store/               # Estado global Zustand
│   │   ├── character-store.ts
│   │   └── app-store.ts
│   ├── types/               # Definiciones TypeScript
│   │   ├── api.ts
│   │   ├── character.ts
│   │   └── common.ts
│   └── lib/                 # Utilidades
│       ├── utils.ts
│       └── constants.ts
├── .env.example             # Template de variables
├── components.json          # Configuración Shadcn
├── tailwind.config.js       # Configuración Tailwind
└── tsconfig.json           # Configuración TypeScript
```

## Contribución

### Agregar Nuevos Módulos

```typescript
// 1. Crear estructura en src/modules/[nuevo-modulo]/
// 2. Definir tipos en types/[modulo].ts
// 3. Implementar servicios en services/[modulo]-api.ts
// 4. Crear store en store/[modulo]-store.ts
// 5. Desarrollar componentes en components/[modulo]/
// 6. Agregar hooks personalizados en hooks/use-[modulo].ts
```
