import { ScrollArea } from '@/components/ui/scroll-area'
import { TaskQuery } from '@/http/task/task-query'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { CommentsSection } from './-components/comments-section'
import { EditTaskDialog } from './-components/edit-task-dialog'
import { RecentHistory } from './-components/recent-history'
import { TaskEditor } from './-components/task-editor'
import { TaskInformation } from './-components/task-information'
import { TaskLoading } from './-components/task-loading'

export const Route = createFileRoute('/_ptd/task/$taskId')({
  component: RouteComponent,
  loader: ({ params, context: { queryClient } }) =>
    queryClient.ensureQueryData(TaskQuery(params.taskId)),
  head: ({ loaderData }) => ({
    meta: [
      {
        name: 'description',
        content: loaderData?.description ?? '',
      },
      {
        title: `TaskDeck - ${loaderData?.title ?? ''}`,
      },
    ],
  }),
})

function RouteComponent() {
  const { taskId } = Route.useParams()
  const { data: task, error } = useSuspenseQuery(TaskQuery(taskId))

  if (error) {
    return <div className='p-6 text-red-500'>Error loading task</div>
  }

  if (!task) {
    return <div className='p-6'>No task data</div>
  }

  return (
    <Suspense fallback={<TaskLoading />}>
      <div className='h-full flex flex-col bg-background'>
        <div className='border-b px-6 py-4 shrink-0 flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>{task.title}</h1>
          <EditTaskDialog task={task} />
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-4 gap-6 p-6 flex-1 overflow-hidden'>
          <div className='col-span-3 overflow-hidden'>
            <ScrollArea className='h-full'>
              <div className='pr-4 space-y-6'>
                {/* Editor Section */}
                <TaskEditor
                  content={task.content}
                  title={task.title}
                  taskId={task.id}
                />

                {/* Recent History Section */}
                <RecentHistory history={task.history} />

                {/* Comments Section */}
                <CommentsSection comments={task.comments} />
              </div>
            </ScrollArea>
          </div>

          {/* Task Information */}
          <TaskInformation task={task} />
        </div>
      </div>
    </Suspense>
  )
}
