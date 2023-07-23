import { atom } from 'jotai'
import type { TPageRoute } from '@renderer/types'

export const currentPageAtom = atom<TPageRoute>('img-fix-restoration')
