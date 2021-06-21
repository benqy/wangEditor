/**
 * @description module menu helpers
 * @author wangfupeng
 */

import { Transforms, Range, Editor } from 'slate'
import { IDomEditor } from '@wangeditor/core'

/**
 * 获取 menu config
 * @param editor editor
 * @param menuKey menuKey
 */
export function getMenuConf(editor: IDomEditor, menuKey: string): { [key: string]: any } {
  const { menuConf } = editor.getConfig()
  const colorConf = menuConf[menuKey]
  return colorConf || {}
}

/**
 * 判断菜单是否要 disabled
 * @param editor editor
 */
export function isMenuDisabled(editor: IDomEditor): boolean {
  const { selection } = editor
  if (selection == null) return true
  if (!Range.isCollapsed(selection)) return true // 选区非折叠，禁用

  const [match] = Editor.nodes(editor, {
    // @ts-ignore
    match: n => {
      // @ts-ignore
      const { type = '' } = n

      if (type === 'code') return true // 行内代码
      if (type === 'pre') return true // 代码块
      if (type === 'link') return true // 链接
      if (type === 'list-item') return true // list
      if (type.startsWith('header')) return true // 标题
      if (type === 'blockquote') return true // 引用
      if (Editor.isVoid(editor, n)) return true // void

      return false
    },
    universal: true,
  })

  if (match) return true
  return false
}

/**
 * 插入图片到编辑器
 * @param editor editor
 * @param src src
 * @param alt alt
 * @param url url
 */
export function insertImage(editor: IDomEditor, src: string, alt: string = '', url: string = '') {
  if (!src) return

  // 还原选区
  // DomEditor.restoreSelection(editor)

  if (isMenuDisabled(editor)) return

  // 新建一个 image node
  const image = {
    type: 'image',
    src,
    url,
    alt,
    style: {},
    children: [{ text: '' }], // 【注意】void node 需要一个空 text 作为 children
  }

  // 插入图片
  Transforms.insertNodes(editor, image)
}