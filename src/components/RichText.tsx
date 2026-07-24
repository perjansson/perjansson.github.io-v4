import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import type { Document } from '@contentful/rich-text-types'

interface RichTextProps {
  richText?: { json: Document }
  className?: string
}

export const RichText: React.FC<RichTextProps> = ({ richText, className }) => {
  if (!richText?.json) {
    return null
  }

  return (
    <div className={`prose ${className ?? ''}`}>
      {documentToReactComponents(richText.json)}
    </div>
  )
}
