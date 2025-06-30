// Utilidades generales
// Funciones helper y configuración de clases 

// Utilidades generales de la aplicación
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Función para combinar clases de Tailwind (usado por Shadcn)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatear fecha
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Formatear texto para mostrar
export function formatText(text: string): string {
  if (!text) return 'Sin información';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// Obtener color para estado de personaje
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'alive':
      return 'bg-green-500';
    case 'dead':
      return 'bg-red-500';
    case 'unknown':
      return 'bg-gray-500';
    default:
      return 'bg-gray-400';
  }
}

// Obtener texto de estado en español
export function getStatusText(status: string): string {
  switch (status.toLowerCase()) {
    case 'alive':
      return 'Vivo';
    case 'dead':
      return 'Muerto';
    case 'unknown':
      return 'Desconocido';
    default:
      return status;
  }
}

// Obtener texto de género en español
export function getGenderText(gender: string): string {
  switch (gender.toLowerCase()) {
    case 'male':
      return 'Masculino';
    case 'female':
      return 'Femenino';
    case 'genderless':
      return 'Sin género';
    case 'unknown':
      return 'Desconocido';
    default:
      return gender;
  }
}

// Validar ID de personaje
export function isValidCharacterId(id: string | number): boolean {
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  return !isNaN(numId) && numId > 0 && numId <= 826; // Máximo de personajes conocido
}

// Extraer ID de URL
export function extractIdFromUrl(url: string): number | null {
  const match = url.match(/\/(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

// Capitalizar primera letra
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Truncar texto
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Limpiar texto para búsqueda
export function cleanSearchText(text: string): string {
  return text.trim().toLowerCase();
}

// Formatear JSON para mostrar
export function formatJSON(obj: Record<string, unknown>): string {
  return JSON.stringify(obj, null, 2);
}

// Delay para funciones async
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
} 