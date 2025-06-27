'use client';

// Hook para debouncing
import { useState, useEffect } from 'react';

/**
 * Hook para debouncing de valores
 * Retrasa la actualización de un valor hasta que haya pasado un tiempo de inactividad
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Establecer un timer que actualice el valor después del delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el timeout si el valor cambia antes del delay
    // o si el componente se desmonta
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
} 