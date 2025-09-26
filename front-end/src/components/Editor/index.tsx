import React, { useEffect } from 'react'
import Canvas from '../EditorCore'
import styles from './index.module.less'
import TooBar from '../ToolBar'

const Editor = () => {

  const initCanvas = () => {
    const graphContainer = document.getElementById('canvas_container') as HTMLElement
    const stencilContainer = document.getElementById('stencil_container') as HTMLElement
    const canvas = new Canvas({ graphContainer, stencilContainer })
  }

  useEffect(() => {
    initCanvas()
  }, [])

  return (
    <div>
      <TooBar />
      <div className={styles.container} id='container'>
        <div className={styles.stencil_container} id="stencil_container"></div>
        <div className={styles.canvas_container} id="canvas_container"></div>
      </div>
    </div>
  )
}

export default Editor