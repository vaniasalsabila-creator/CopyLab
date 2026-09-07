import { Fragment } from 'react'
import { parseBlocks, parseInline } from '../lib/richText'

export function InlineText({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((token, i) => {
        let node = <Fragment key={i}>{token.text}</Fragment>
        if (token.bold) node = <strong key={i}>{node}</strong>
        if (token.italic) node = <em key={i}>{node}</em>
        if (token.underline) node = <u key={i}>{node}</u>
        return node
      })}
    </>
  )
}

export function FormattedText({ text, className = '' }: { text: string; className?: string }) {
  if (!text) return null
  return (
    <div className={`space-y-1.5 ${className}`}>
      {parseBlocks(text).map((block, i) => {
        if (block.type === 'quote') {
          return (
            <blockquote key={i} className="space-y-0.5 border-l-2 border-current/30 pl-2 italic opacity-90">
              {block.lines.map((line, j) => (
                <div key={j} className="whitespace-pre-wrap break-words">
                  <InlineText text={line} />
                </div>
              ))}
            </blockquote>
          )
        }
        if (block.type === 'list') {
          return (
            <ul key={i} className="list-disc space-y-0.5 pl-4">
              {block.lines.map((line, j) => (
                <li key={j} className="whitespace-pre-wrap break-words">
                  <InlineText text={line} />
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={i} className="whitespace-pre-wrap break-words">
            {block.lines.map((line, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                <InlineText text={line} />
              </Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}
