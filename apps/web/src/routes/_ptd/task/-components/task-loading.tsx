import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

export function TaskLoading() {
  return (
    <div className='h-full flex flex-col bg-background'>
      {/* Header Skeleton */}
      <div className='border-b px-6 py-4 shrink-0 flex items-center justify-between'>
        <Skeleton className='h-9 w-64' />
        <Skeleton className='h-10 w-10 rounded-md' />
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-4 gap-6 p-6 flex-1 overflow-hidden'>
        {/* Left Column - Main Content */}
        <div className='col-span-3 overflow-hidden'>
          <ScrollArea className='h-full'>
            <div className='pr-4 space-y-6'>
              {/* Editor Section */}
              <div className='space-y-2'>
                <Skeleton className='h-40 w-full' />
              </div>

              {/* Recent History Section */}
              <div className='space-y-4'>
                <Skeleton className='h-6 w-40' />
                <div className='space-y-3'>
                  <Skeleton className='h-12 w-full' />
                  <Skeleton className='h-12 w-full' />
                </div>
              </div>

              {/* Comments Section */}
              <div className='space-y-4'>
                <Skeleton className='h-6 w-32' />
                <div className='space-y-3'>
                  <Skeleton className='h-16 w-full' />
                  <Skeleton className='h-16 w-full' />
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Right Column - Task Information */}
        <div className='space-y-6 bg-muted p-6'>
          {/* Description */}
          <div className='space-y-2'>
            <Skeleton className='h-5 w-24' />
            <Skeleton className='h-20 w-full' />
          </div>

          {/* Status */}
          <div className='space-y-2'>
            <Skeleton className='h-5 w-16' />
            <Skeleton className='h-8 w-24' />
          </div>

          {/* Priority */}
          <div className='space-y-2'>
            <Skeleton className='h-5 w-16' />
            <Skeleton className='h-8 w-20' />
          </div>

          {/* Expira em */}
          <div className='space-y-2'>
            <Skeleton className='h-5 w-24' />
            <Skeleton className='h-5 w-32' />
          </div>

          {/* Assignees */}
          <div className='space-y-2'>
            <Skeleton className='h-5 w-24' />
            <Skeleton className='h-8 w-full' />
          </div>

          {/* Created */}
          <div className='space-y-2'>
            <Skeleton className='h-5 w-16' />
            <Skeleton className='h-5 w-32' />
          </div>

          {/* Updated */}
          <div className='space-y-2'>
            <Skeleton className='h-5 w-20' />
            <Skeleton className='h-5 w-32' />
          </div>
        </div>
      </div>
    </div>
  )
}
