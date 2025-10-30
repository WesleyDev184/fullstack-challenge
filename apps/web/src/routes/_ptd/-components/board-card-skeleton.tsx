import { Skeleton } from '@/components/ui/skeleton'

export function BoardCardSkeleton() {
  return (
    <div className='bg-card rounded-lg p-3 shadow hover:shadow-md transition-all duration-200 border border-border hover:border-ring cursor-grab active:cursor-grabbing group'>
      {/* Card Header Skeleton */}
      <Skeleton className='h-4 w-3/4 mb-2' />

      {/* Card Content Skeleton */}
      <Skeleton className='h-3 w-full mb-1' />
      <Skeleton className='h-3 w-5/6 mb-3' />

      {/* Card Footer Skeleton */}
      <div className='flex items-center gap-2 mt-2'>
        <Skeleton className='h-4 w-12' />
        <div className='ml-auto'>
          <Skeleton className='h-6 w-6 rounded-full' />
        </div>
      </div>
    </div>
  )
}
