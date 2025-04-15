import { memo, useState } from 'react'

const CollapsibleSectionComponent = ({
  title,
  content,
  isList = false,
}: {
  title: string
  content: string[] | string
  isList?: boolean
}) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="aic-collapsible">
      <button onClick={() => setOpen((v) => !v)} className="aic-toggle">
        {open ? '▼' : '▶'} {title}
      </button>
      {open &&
        (isList ? (
          <ul className="aic-collapsible-content">
            {(content as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="aic-collapsible-content">{content as string}</p>
        ))}
    </div>
  )
}

const CollapsibleSection = memo(CollapsibleSectionComponent)

export default CollapsibleSection
