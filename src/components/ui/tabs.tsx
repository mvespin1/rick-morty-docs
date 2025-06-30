import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface TabPanelProps {
  tabId: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ tabs, defaultTab, onChange, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className={cn('w-full h-full flex flex-col', className)}>
      {/* Tab Headers */}
      <div className="flex bg-muted/5 backdrop-blur-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              'flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-300 relative flex-1',
              activeTab === tab.id
                ? 'text-foreground bg-background/50 shadow-sm border-b border-border/50'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/20'
            )}
          >
            {tab.icon}
            {tab.label}
            {/* Indicador */}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export function TabPanel({ tabId, activeTab, children, className }: TabPanelProps) {
  if (tabId !== activeTab) return null;

  return (
    <div className={cn('h-full overflow-hidden', className)}>
      {children}
    </div>
  );
} 