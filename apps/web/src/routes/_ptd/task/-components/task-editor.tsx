import { useTheme } from '@/hooks/use-theme'
import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core'
import { BlockNoteView } from '@blocknote/mantine'
import { useCreateBlockNote, useEditorChange } from '@blocknote/react'
import { useEffect, useState } from 'react'

const AUTOSAVE_INTERVAL = 60 * 1000 // 60 seconds

type TaskEditorProps = {
  content?: string
  title: string
}

export function TaskEditor({ content, title }: TaskEditorProps) {
  const { theme } = useTheme()
  const [markdown, setMarkdown] = useState<string>('')

  const { audio, image, video, file, ...remainingBlockSpecs } =
    defaultBlockSpecs

  const schema = BlockNoteSchema.create({
    blockSpecs: {
      ...remainingBlockSpecs,
    },
  })

  const editor = useCreateBlockNote({
    schema,
    tables: {
      splitCells: true,
      cellBackgroundColor: true,
      cellTextColor: true,
      headers: true,
    },
  })

  useEditorChange(editor => {
    const markdown = editor.blocksToMarkdownLossy(editor.document)
    console.log(markdown)
    setMarkdown(markdown)
  }, editor)

  useEffect(() => {
    function loadInitialHTML() {
      const blocks = editor.tryParseMarkdownToBlocks(content || `${title}`)
      editor.replaceBlocks(editor.document, blocks)
    }
    loadInitialHTML()
  }, [editor])

  return (
    <div>
      <h2 className='text-lg font-semibold mb-3'>Content</h2>
      <div className='border rounded-lg overflow-hidden'>
        <BlockNoteView editor={editor} theme={theme ? 'dark' : 'light'} />
      </div>
    </div>
  )
}
