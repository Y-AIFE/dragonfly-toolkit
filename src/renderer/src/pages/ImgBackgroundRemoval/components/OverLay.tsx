import React from 'react'

type Props = {
  children: React.ReactNode
}

export default function OverLay({ children }: Props) {
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,.3)]">
      {children}
    </div>
  )
}
