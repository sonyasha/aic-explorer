import { useCallback, useState } from 'react'

type Props = {
  src: string
  alt: string
  fallback600: string
  fallback400: string
}

const ZoomableImage: React.FC<Props> = ({ src, alt, fallback600, fallback400 }) => {
  const [isZoomed, setIsZoomed] = useState(false)
  const [imgSrc, setImgSrc] = useState(src)

  const toggleZoom = useCallback(() => {
    setIsZoomed((z) => !z)
  }, [])

  const handleError = useCallback(() => {
    if (!imgSrc.includes('600')) {
      setImgSrc(fallback600)
    } else {
      setImgSrc(fallback400)
    }
  }, [imgSrc, fallback600, fallback400])

  return (
    <div className={`aic-artwork-image-wrapper ${isZoomed ? 'zoomed' : ''}`} onClick={toggleZoom}>
      <img className="aic-artwork-image" src={imgSrc} alt={alt} onError={handleError} />
    </div>
  )
}

export default ZoomableImage
