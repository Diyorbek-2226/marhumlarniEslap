import { create } from 'zustand';

interface LocationState {
  selectedRegion: string;
  selectedDistrict: string;
  setSelectedRegion: (region: string) => void;
  setSelectedDistrict: (district: string) => void;
  reset: () => void;
}

export const useLocationState = create<LocationState>((set) => ({
  selectedRegion: '',
  selectedDistrict: '',
  setSelectedRegion: (region) => set({ selectedRegion: region, selectedDistrict: '' }),
  setSelectedDistrict: (district) => set({ selectedDistrict: district }),
  reset: () => set({ selectedRegion: '', selectedDistrict: '' }),
}));