import { memo } from 'react'

import useCollapsible from '../../hooks/useCollapsible'

type Props = {
  title: string
  content: string[] | string
  isList?: boolean
}
const CollapsibleSection: React.FC<Props> = ({ title, content, isList = false }) => {
  const { isOpen, toggle } = useCollapsible()
  return (
    <div className="aic-collapsible">
      <button onClick={toggle} className="aic-toggle">
        {isOpen ? '▼' : '▶'} {title}
      </button>
      {isOpen &&
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

export default memo(CollapsibleSection)
