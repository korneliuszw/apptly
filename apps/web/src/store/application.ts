import { create } from "zustand";
import { Application } from "../types/application.types";

interface ApplicationState {
    selectedApplicationId: Application["id"] | null;
    setSelectedApplicationId: (id: string) => void;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
    selectedApplicationId: null,
    setSelectedApplicationId: (id: string) => set({ selectedApplicationId: id })
}));