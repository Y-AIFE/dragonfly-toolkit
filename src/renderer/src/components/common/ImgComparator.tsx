import React, { useState, useRef, useEffect } from 'react'

type Props = {
  sourceUrl: string
  outputUrl: string
  pos?: number
}

export default function ImgComparator({ sourceUrl, outputUrl, pos }: Props) {
  const [cropWidth, setCropWidth] = useState(0)
  const draggerRef = useRef<HTMLDivElement>(null)
  const sourceImgRef = useRef<HTMLImageElement>(null)
  pos = pos ?? 85

  useEffect(() => {
    const dragger = draggerRef.current
    const handleDrag = (e) => {
      const { left, width } = (
        sourceImgRef.current as HTMLImageElement
      ).getBoundingClientRect()
      const parentWidth = (dragger?.parentNode as HTMLDivElement).offsetWidth
      const relativeDistance = e.clientX - left
      const min = 0
      const max = width
      const dis = parentWidth - relativeDistance
      setCropWidth(Math.max(Math.min(max, dis), min))
    }

    dragger?.addEventListener('mousedown', () => {
      window.addEventListener('mousemove', handleDrag)
    })

    window.addEventListener('mouseup', () => {
      window.removeEventListener('mousemove', handleDrag)
    })

    return () => {
      window.removeEventListener('mousemove', handleDrag)
    }
  }, [outputUrl])
  return (
    <div className="relative">
      <img
        src={outputUrl}
        alt="output"
        className="max-h-full max-w-full select-none object-contain"
        draggable={false}
      />
      <img
        ref={sourceImgRef}
        src={sourceUrl}
        alt="source"
        className="absolute left-0 top-0 z-10 max-h-full max-w-full select-none object-contain"
        style={{ clipPath: `inset(0 ${cropWidth}px 0 0)` }}
        draggable={false}
        onLoad={() => {
          const rect = sourceImgRef.current!.getBoundingClientRect()
          console.log('load', rect)
          setCropWidth(((100 - pos!) * rect.width) / 100)
        }}
      />
      <div
        ref={draggerRef}
        className="absolute top-0 z-20 h-full w-2 bg-slate-300 px-1 hover:bg-slate-400"
        style={{ right: `${cropWidth - 2}px` }}></div>
    </div>
  )
}
