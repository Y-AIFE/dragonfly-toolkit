import React from 'react'
import { PictureOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Menu } from 'antd'
import { useAtom } from 'jotai'
import { currentPageAtom } from '@renderer/store'
import type { TPageRoute } from '@renderer/types'

type Props = {}
type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem
}

const items: MenuItem[] = [
  getItem('图像修复', 'img-fix-restoration', <PictureOutlined />),
  getItem('AI 抠图', 'img-background-removal', <PictureOutlined />),
]

export default function Navbar({}: Props) {
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom)
  const navigate = useNavigate()

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrentPage(e.key as TPageRoute)
    navigate(`/` + e.key)
  }
  console.log('currentPage', currentPage)
  return (
    <div className="w-[200px] bg-white">
      <Menu
        onClick={onClick}
        mode="inline"
        style={{ width: 200 }}
        items={items}
        selectedKeys={[currentPage]}
      />
    </div>
  )
}
