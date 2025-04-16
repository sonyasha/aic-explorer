import { useCallback, useState } from 'react'

const useCollapsible = (initialOpen: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen)

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  return { isOpen, toggle, open, close }
}

export default useCollapsible
