'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { mockClients } from '@/lib/mock-data';
import type { Client, BiometricReading, ComputedNutrition } from '@/types';

interface AppContextType {
  clients: Client[];
  updateClientScan: (clientId: string, biometrics: BiometricReading, nutrition: ComputedNutrition) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const updateClientScan = useCallback(
    (clientId: string, biometrics: BiometricReading, nutrition: ComputedNutrition) => {
      setClients((prev) =>
        prev.map((c) =>
          c.id === clientId
            ? {
                ...c,
                latest_biometrics: biometrics,
                latest_nutrition: nutrition,
                last_checkin: new Date().toISOString().split('T')[0],
                days_inactive: 0,
                status: 'active' as const,
              }
            : c
        )
      );
    },
    []
  );

  return (
    <AppContext.Provider
      value={{
        clients,
        updateClientScan,
        sidebarCollapsed,
        setSidebarCollapsed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
