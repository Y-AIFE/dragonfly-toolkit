import React, { useState, useRef, useEffect } from 'react'

type Props = {
  sourceUrl: string
  outputUrl: string
  pos?: number
}

export default function ImgComparator({ sourceUrl, outputUrl, pos }: Props) {
  // 裁剪宽度，相对于图片右侧的距离
  const [cropWidth, setCropWidth] = useState(0)
  // 图片显示时的实际尺寸
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>(
    { width: 0, height: 0 },
  )
  const [imagePos, setImagePos] = useState<{ left: number; top: number }>({
    left: 0,
    top: 0,
  })
  const draggerRef = useRef<HTMLDivElement>(null)
  const sourceImgRef = useRef<HTMLImageElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  pos = pos ?? 50
  const hasOutput = outputUrl.length > 0

  const handleSourceImgLoad = () => {
    const imgRect = (
      sourceImgRef.current as HTMLImageElement
    ).getBoundingClientRect()
    const wrapperRect = (
      sourceImgRef.current?.parentNode as HTMLDivElement
    ).getBoundingClientRect()
    setImagePos({ left: imgRect.left - wrapperRect.left, top: imgRect.top })
    console.log('srcimgRect', imgRect)
    setImageSize({ width: imgRect.width, height: imgRect.height })
  }

  useEffect(() => {
    const dragger = draggerRef.current
    const min = 0
    const max = imageSize.width
    const wrapperRect = (
      sourceImgRef.current?.parentNode as HTMLDivElement
    ).getBoundingClientRect()
    if (hasOutput) {
      const initDis = ((100 - (pos as number)) * imageSize.width) / 100
      console.log('initDis', initDis)
      setCropWidth(initDis)
    }
    const handleDrag = (e) => {
      const relativeDistance = Math.max(
        min,
        Math.min(e.clientX - wrapperRect.left - imagePos.left, max),
      )
      const dis = imageSize.width - relativeDistance
      console.log('dis', dis, e, imagePos)
      setCropWidth(dis)
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
  }, [outputUrl, imageSize, imagePos, hasOutput])
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <img
        ref={sourceImgRef}
        src={sourceUrl}
        alt="source"
        className="pointer-events-none max-h-[calc(100%-20px)] max-w-[calc(100%-20px)] select-none object-contain"
        style={{ clipPath: `inset(0 ${cropWidth}px 0 0)` }}
        draggable={false}
        onLoad={handleSourceImgLoad}
      />
      {hasOutput && (
        <img
          ref={imgRef}
          src={outputUrl}
          alt="output"
          className="pointer-events-none absolute z-10 max-h-[calc(100%-20px)] max-w-[calc(100%-20px)] select-none object-contain"
          style={{
            left: imagePos.left,
            top: imagePos.top,
          }}
          draggable={false}
        />
      )}
      {hasOutput && (
        <div
          ref={draggerRef}
          className="absolute top-0 z-20 w-2 bg-slate-300 px-1 hover:bg-slate-400"
          style={{
            left: `${imagePos.left + imageSize.width - cropWidth}px`,
            top: imagePos.top,
            height: imageSize.height,
          }}></div>
      )}
    </div>
  )
}
