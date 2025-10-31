import { EmailsQuery } from '@/http/auth/auth.query'
import type { TaskCommentDto } from '@/http/task/dto/task-dto'
import { useSuspenseQuery } from '@tanstack/react-query'

type CommentsSectionProps = {
  comments?: TaskCommentDto[]
}

export function CommentsSection({ comments }: CommentsSectionProps) {
  // Extrair sem repetições de IDs dos autores dos comentários
  const assigneesIds = Array.from(
    new Set(comments?.map(comment => comment.authorId) || []),
  )
  const { data: emailMap } = useSuspenseQuery(EmailsQuery(assigneesIds))

  return (
    <div>
      <h2 className='text-lg font-semibold mb-3'>
        Comments ({comments?.length ?? 0})
      </h2>
      <div className='space-y-3'>
        {comments && comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className='border rounded-lg p-4'>
              <p className='text-sm text-muted-foreground mb-2'>
                {emailMap[comment.authorId]} •{' '}
                {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
              </p>
              <p>{comment.content}</p>
            </div>
          ))
        ) : (
          <p className='text-muted-foreground'>No comments yet</p>
        )}
      </div>
    </div>
  )
}
