import create from 'zustand';

type GlobalLoadingState = {
  isGlobalLoading: boolean;
  setGlobalLoading: (state: boolean) => void;
};

export const useGlobalLoadingStore = create<GlobalLoadingState>((set) => ({
  isGlobalLoading: false,
  setGlobalLoading: (state) => set({ isGlobalLoading: state }),
}));
