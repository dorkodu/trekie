import { create } from 'zustand'

interface MomentumUIState {
  showAdvanced: boolean
  toggleAdvanced(): void
}

export const useMomentumUI = create<MomentumUIState>(set => ({
  showAdvanced: false,
  toggleAdvanced: () => set(s => ({ showAdvanced: !s.showAdvanced }))
}))