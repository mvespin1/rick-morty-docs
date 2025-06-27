// Store global de la aplicación
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AppStore {
  // Estado de la aplicación
  isOnline: boolean;
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  
  // Estado de notificaciones
  notifications: Notification[];
  
  // Estado de configuración
  preferences: {
    autoGenerateAI: boolean;
    showDebugInfo: boolean;
    cacheEnabled: boolean;
    resultsPerPage: number;
  };
  
  // Última actividad
  lastActivity: number;
  
  // Acciones de UI
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Acciones de notificaciones
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Acciones de configuración
  updatePreferences: (prefs: Partial<AppStore['preferences']>) => void;
  resetPreferences: () => void;
  
  // Utilidades
  updateActivity: () => void;
  setOnlineStatus: (online: boolean) => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  timestamp: number;
  autoRemove?: boolean;
  duration?: number;
}

const defaultPreferences = {
  autoGenerateAI: false,
  showDebugInfo: false,
  cacheEnabled: true,
  resultsPerPage: 20,
};

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        isOnline: true,
        theme: 'system',
        sidebarOpen: false,
        notifications: [],
        preferences: defaultPreferences,
        lastActivity: Date.now(),

        // Acciones de UI
        setSidebarOpen: (open: boolean) => {
          set({ sidebarOpen: open });
        },

        toggleSidebar: () => {
          set((state) => ({ sidebarOpen: !state.sidebarOpen }));
        },

        setTheme: (theme: 'light' | 'dark' | 'system') => {
          set({ theme });
        },

        // Acciones de notificaciones
        addNotification: (notification) => {
          const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const timestamp = Date.now();
          
          const newNotification: Notification = {
            id,
            timestamp,
            autoRemove: true,
            duration: 5000,
            ...notification,
          };

          set((state) => ({
            notifications: [...state.notifications, newNotification],
          }));

          // Auto-remover si está configurado
          if (newNotification.autoRemove && newNotification.duration) {
            setTimeout(() => {
              get().removeNotification(id);
            }, newNotification.duration);
          }
        },

        removeNotification: (id: string) => {
          set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id),
          }));
        },

        clearNotifications: () => {
          set({ notifications: [] });
        },

        // Acciones de configuración
        updatePreferences: (prefs) => {
          set((state) => ({
            preferences: { ...state.preferences, ...prefs },
          }));
        },

        resetPreferences: () => {
          set({ preferences: defaultPreferences });
        },

        // Utilidades
        updateActivity: () => {
          set({ lastActivity: Date.now() });
        },

        setOnlineStatus: (online: boolean) => {
          set({ isOnline: online });
          
          // Notificar cambio de conectividad
          if (!online) {
            get().addNotification({
              type: 'warning',
              title: 'Sin conexión',
              message: 'Comprueba tu conexión a internet',
              autoRemove: false,
            });
          } else {
            // Remover notificaciones de desconexión
            const { notifications } = get();
            const filteredNotifications = notifications.filter(
              n => n.title !== 'Sin conexión'
            );
            set({ notifications: filteredNotifications });
          }
        },
      }),
      {
        name: 'rick-morty-app-store',
        // Solo persistir preferencias y tema
        partialize: (state) => ({
          theme: state.theme,
          preferences: state.preferences,
        }),
      }
    ),
    { name: 'app-store' }
  )
);

// Hook para mostrar notificaciones fácilmente
export const useNotifications = () => {
  const { addNotification, removeNotification, clearNotifications } = useAppStore();
  
  const showSuccess = (title: string, message?: string) => {
    addNotification({ type: 'success', title, message });
  };
  
  const showError = (title: string, message?: string) => {
    addNotification({ 
      type: 'error', 
      title, 
      message,
      autoRemove: false 
    });
  };
  
  const showWarning = (title: string, message?: string) => {
    addNotification({ type: 'warning', title, message });
  };
  
  const showInfo = (title: string, message?: string) => {
    addNotification({ type: 'info', title, message });
  };
  
  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    remove: removeNotification,
    clear: clearNotifications,
  };
};

// Hook para detectar estado online/offline
export const useOnlineStatus = () => {
  const { isOnline, setOnlineStatus } = useAppStore();
  
  // Este hook se puede extender para manejar eventos de red reales
  return { isOnline, setOnlineStatus };
};

// Hook para preferencias
export const usePreferences = () => {
  const { preferences, updatePreferences, resetPreferences } = useAppStore();
  
  return {
    preferences,
    updatePreferences,
    resetPreferences,
  };
}; 