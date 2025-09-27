import React, { useEffect, useState } from 'react'
import Canvas from '../EditorCore'
import styles from './index.module.less'
import TooBar from '../ToolBar'

const Editor = () => {
  const canvas = React.useRef<Canvas | null>(null)
  const [canvasReady, setCanvasReady] = useState(false)

  const initCanvas = () => {
    const graphContainer = document.getElementById('canvas_container') as HTMLElement
    const stencilContainer = document.getElementById('stencil_container') as HTMLElement
    canvas.current = new Canvas({ graphContainer, stencilContainer })
    window.canvas = canvas.current
    setCanvasReady(true)
  }

  useEffect(() => {
    initCanvas()
  }, [])

  return (
    <div>
      <TooBar canvas={canvas} canvasReady={canvasReady} />
      <div className={styles.container} id='container'>
        <div className={styles.stencil_container} id="stencil_container"></div>
        <div className={styles.canvas_container} id="canvas_container"></div>
      </div>
    </div>
  )
}

export default Editor