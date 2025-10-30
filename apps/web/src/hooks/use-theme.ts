import { useThemeStore } from '@/stores/theme-store'

/**
 * Hook de tema que abstrai completamente o Zustand store
 * Fornece uma interface limpa para gerenciamento de tema
 *
 * Use este hook ao invés de acessar o store diretamente
 */
export const useTheme = () => {
  const theme = useThemeStore(state => state.theme)
  const setTheme = useThemeStore(state => state.setTheme)

  return {
    theme,
    setTheme,
  }
}
