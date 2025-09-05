import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface HousingAd {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  price: number;
  bedrooms: number;
  bathrooms: number;
  dates_available: string;
  amenities: string[] | null;
  complex_name: string | null;
  university: string;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
  poster_name?: string;
}

export function useHousingAds() {
  const [ads, setAds] = useState<HousingAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('housing_ads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const adsWithPoster = data?.map(ad => ({
        ...ad,
        poster_name: 'Anonymous' // Will be improved when profiles table is properly linked
      })) || [];

      setAds(adsWithPoster);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ads');
    } finally {
      setLoading(false);
    }
  };

  const searchAds = async (searchTerm: string, universityFilter?: string, priceRange?: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('housing_ads')
        .select('*');

      if (searchTerm.trim()) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,complex_name.ilike.%${searchTerm}%`);
      }

      if (universityFilter && universityFilter !== 'all') {
        const university = universityFilter === 'uga' ? 'University of Georgia' : 'Georgia Tech';
        query = query.eq('university', university);
      }

      if (priceRange && priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(p => p.replace('+', ''));
        if (max) {
          query = query.gte('price', parseInt(min)).lte('price', parseInt(max));
        } else {
          query = query.gte('price', parseInt(min));
        }
      }

      query = query.order('is_premium', { ascending: false })
                   .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      const adsWithPoster = data?.map(ad => ({
        ...ad,
        poster_name: 'Anonymous' // Will be improved when profiles table is properly linked
      })) || [];

      setAds(adsWithPoster);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search ads');
    } finally {
      setLoading(false);
    }
  };

  const createAd = async (adData: Omit<HousingAd, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const { data, error } = await supabase
        .from('housing_ads')
        .insert([{
          ...adData,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchAds(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to create ad' };
    }
  };

  return {
    ads,
    loading,
    error,
    fetchAds,
    searchAds,
    createAd
  };
}