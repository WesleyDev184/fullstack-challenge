import { useTheme } from '@/hooks/use-theme'
import { useUpdateTaskMutation } from '@/http/task/task-query'
import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core'
import { BlockNoteView } from '@blocknote/mantine'
import { useCreateBlockNote, useEditorChange } from '@blocknote/react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

// A higher-order function for debouncing. This prevents the save function
// from being called on every single keystroke, improving performance.
function debounce<F extends (...args: any) => void>(func: F, waitFor: number) {
  let timeout: NodeJS.Timeout | null = null

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), waitFor)
  }

  return debounced
}

// Set a debounce interval. 20 seconds is a good starting point.
const AUTOSAVE_DEBOUNCE_INTERVAL = 20000 // 20 seconds

type TaskEditorProps = {
  content?: string
  title: string
  taskId: string
}

export function TaskEditor({ content, title, taskId }: TaskEditorProps) {
  const { theme } = useTheme()
  // This flag is useful to prevent auto-saving before the initial content is loaded.
  const [isInitialized, setIsInitialized] = useState(false)

  const updateTask = useUpdateTaskMutation()

  // Standard schema setup, removing unsupported block types.
  const { audio, image, video, file, ...remainingBlockSpecs } =
    defaultBlockSpecs

  const schema = BlockNoteSchema.create({
    blockSpecs: {
      ...remainingBlockSpecs,
    },
  })

  const editor = useCreateBlockNote({
    schema,
  })

  // Effect for loading the initial HTML content into the editor.
  useEffect(() => {
    // Ensure the editor is ready, content exists, and we haven't initialized yet.
    if (editor && content && !isInitialized) {
      const blocks = editor.tryParseHTMLToBlocks(content)
      editor.replaceBlocks(editor.document, blocks)
      setIsInitialized(true)
    } else if (!content) {
      const blocks = editor.tryParseHTMLToBlocks(`<h1>${title}</h1>`)
      editor.replaceBlocks(editor.document, blocks)
      // If there's no content, we can consider it initialized.
      setIsInitialized(true)  
    }
  }, [editor, content, isInitialized])

  // The core save logic, wrapped in useCallback for stability.
  const saveContent = useCallback(
    async (document: string) => {
      try {
        await updateTask.mutateAsync({
          id: taskId,
          data: { content: document },
        })

        toast.success('Projeto salvo com sucesso!')
      } catch (error) {
        console.error('Error auto-saving project:', error)
        toast.error('Ocorreu um erro ao salvar o projeto.')
      }
    },
    [editor, updateTask, taskId],
  )

  // Create a debounced version of the save function.
  const debouncedSave = useCallback(
    debounce((document: string) => {
      saveContent(document)
    }, AUTOSAVE_DEBOUNCE_INTERVAL),
    [saveContent], // This dependency array ensures the debounced function is stable.
  )
  // This is the correct way to handle auto-saving with BlockNote.
  // The `useEditorChange` hook fires whenever the content is modified.
  useEditorChange(editor => {
    // We wait for initialization to complete to avoid saving the empty default state.
    if (!isInitialized) {
      return
    }

    const html = editor.blocksToHTMLLossy(editor.document)
    // On every change, call the debounced saver with a cast to PartialBlock[] to satisfy types.
    debouncedSave(html)
  }, editor)

  return (
    <div className='border rounded-lg overflow-hidden'>
      <BlockNoteView editor={editor} theme={theme ? 'dark' : 'light'} />
    </div>
  )
}
