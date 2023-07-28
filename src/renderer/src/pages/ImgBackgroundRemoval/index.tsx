import { useState } from 'react'
import imglyRemoveBackground, { Config } from '@imgly/background-removal'
import { Spin, Button, Upload } from 'antd'
import { InboxOutlined, CloseOutlined } from '@ant-design/icons'
import classnames from 'classnames'
import ImgComparator from '@renderer/components/common/ImgComparator'
import OverLay from './components/OverLay'
import type { UploadChangeParam } from 'antd/lib/upload'

type Props = {}

const loadedFiles = new Set()

export default function ImgBackgroundRemoval({}: Props) {
  const [sourceImg, setSourceImg] = useState<File>()
  const [sourceImgUrl, setSourceImgUrl] = useState('')
  const [processedImgUrl, setProcessedImgUrl] = useState('')
  const [isInferencing, setIsInferencing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadingPercent, setDownloadingPercent] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [showStep, setShowStep] = useState(0)

  const handleImgChange = (info: UploadChangeParam) => {
    const file = info.file as unknown as File
    if (file) {
      const url = URL.createObjectURL(file)
      setSourceImgUrl(url)
      setSourceImg(file)
      setShowStep(1)
    }
  }

  const handleStartProcess = async () => {
    // 使用 imageBlob 进行你的操作
    if (sourceImg) {
      setIsDownloading(true)
      // @ts-ignore
      const config: Config = {
        debug: true,
        progress: (key, current, total) => {
          if (key === 'compute:inference') {
            setIsInferencing(true)
            setIsDownloading(false)
          } else {
            setIsDownloading(true)
            loadedFiles.add(key)
            const percent = `${Math.floor((current * 100) / total)}%`
            setDownloadingPercent(percent)
            // console.log(`Downloading ${key}|${loadedFiles.size}|${percent}`)
          }
        },
      }
      try {
        const blob = await imglyRemoveBackground(sourceImg, config)
        const url = URL.createObjectURL(blob)
        setShowStep(2)
        setProcessedImgUrl(url)
      } catch (e) {
        setErrMsg(String(e))
      } finally {
        setIsInferencing(false)
      }
    }
  }

  const handleSave = () => {
    // 保存 processedImgUrl 对应的图片
  }

  const handleReset = () => {
    setSourceImg(undefined)
    setSourceImgUrl('')
    setProcessedImgUrl('')
    setIsInferencing(false)
    setIsDownloading(false)
    setDownloadingPercent('0%')
    setErrMsg('')
    setShowStep(0)
  }

  let overLayText = ''
  if (isDownloading) {
    overLayText = `模型下载中 ${downloadingPercent}（${loadedFiles.size}/5） `
  } else if (isInferencing) {
    overLayText = '处理中'
  }

  const inner = (
    <div
      className={classnames(
        'flex h-[100vh] w-[calc(100vw-200px)] items-center justify-center rounded-xl text-center transition-all',
        showStep === 0 &&
          'border border-dashed border-gray-300 hover:border-gray-600',
      )}>
      {showStep === 0 && (
        <div>
          <p className="text-[60px] text-primary">
            <InboxOutlined />
          </p>
          <p className="text-[20px]">点击 或者 拖拽文件上传</p>
        </div>
      )}
      {showStep !== 0 && (
        <ImgComparator sourceUrl={sourceImgUrl} outputUrl={processedImgUrl} />
      )}
    </div>
  )

  return (
    <div className="relative box-border h-full bg-white">
      {showStep !== 0 && (
        <div
          className="absolute right-4 top-4 z-10 flex cursor-pointer items-center justify-center rounded-full bg-gray-500 p-3 text-xl opacity-60 hover:opacity-100"
          onClick={handleReset}>
          <CloseOutlined />
        </div>
      )}
      {showStep === 0 ? (
        <Upload
          name="file"
          showUploadList={false}
          beforeUpload={() => false} // 阻止自动上传
          onChange={handleImgChange}>
          {inner}
        </Upload>
      ) : (
        inner
      )}
      <div className="absolute bottom-5 right-5 z-20">
        {showStep === 1 && (
          <Button type="primary" onClick={handleStartProcess} size="large">
            开始处理
          </Button>
        )}
        {showStep === 2 && (
          <Button
            type="default"
            className="ml-3"
            onClick={handleSave}
            size="large">
            保存
          </Button>
        )}
      </div>
      {isDownloading || isInferencing ? (
        <OverLay>
          <div className="flex select-none items-center rounded-xl bg-[rgba(255,255,255,.9)] bg-white px-[40px] py-[30px]">
            <Spin size="large" />
            <span className="ml-3 text-xl font-bold">{overLayText}</span>
          </div>
        </OverLay>
      ) : null}
    </div>
  )
}
