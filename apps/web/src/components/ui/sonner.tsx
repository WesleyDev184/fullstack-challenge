import { useTheme } from '@/hooks/use-theme'
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      icons={{
        success: <CircleCheckIcon className='size-4 text-emerald-500' />,
        info: <InfoIcon className='size-4 text-primary' />,
        warning: <TriangleAlertIcon className='size-4 text-yellow-500' />,
        error: <OctagonXIcon className='size-4 text-destructive' />,
        loading: <Loader2Icon className='size-4 animate-spin text-primary' />,
      }}
      style={
        {
          '--normal-bg': 'var(--card)',
          '--normal-text': 'var(--card-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
