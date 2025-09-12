import { useState, useEffect } from 'react';
import type { ModuleWithProgress, Language } from '../config/module.types';

export function useModules(language: string) {
  const [modules, setModules] = useState<ModuleWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      if (!language || language === 'all') {
        setModules([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/modules?language=${language}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch modules');
        }
        
        const data = await response.json();
        setModules(data);
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch modules');
        setModules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [language]);

  const refetch = () => {
    const fetchModules = async () => {
      if (!language || language === 'all') return;

      try {
        setError(null);
        const response = await fetch(`/api/modules?language=${language}`);
        if (!response.ok) {
          throw new Error('Failed to fetch modules');
        }
        const data = await response.json();
        setModules(data);
      } catch (err) {
        console.error('Error refetching modules:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch modules');
      }
    };

    fetchModules();
  };

  return {
    modules,
    loading,
    error,
    refetch,
  };
}