import { useThemeStore } from '@/stores/theme-store'
import { useEffect } from 'react'

/**
 * Componente para inicializar o tema na montagem da aplicação
 * Aplica o tema salvo no Zustand persist ao DOM
 */
export function ThemeInitializer() {
  const theme = useThemeStore(state => state.theme)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)

      // Listener para mudanças no tema do sistema
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        root.classList.remove('light', 'dark')
        root.classList.add(e.matches ? 'dark' : 'light')
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  return null
}
