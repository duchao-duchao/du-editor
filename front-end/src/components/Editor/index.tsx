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
    const miniMapContainer = document.getElementById('mini_map') as HTMLElement
    
    // 清理之前的实例
    if (canvas.current) {
      canvas.current.graph?.dispose()
      canvas.current = null
    }
    
    // 清理容器内容
    if (miniMapContainer) {
      miniMapContainer.innerHTML = ''
    }
    if (graphContainer) {
      graphContainer.innerHTML = ''
    }
    if (stencilContainer) {
      stencilContainer.innerHTML = ''
    }
    
    canvas.current = new Canvas({ graphContainer, stencilContainer, miniMapContainer })
    window.canvas = canvas.current
    setCanvasReady(true)
  }

  useEffect(() => {
    initCanvas()
    
    // 清理函数
    return () => {
      if (canvas.current) {
        canvas.current.graph?.dispose()
        canvas.current = null
      }
      setCanvasReady(false)
    }
  }, [])

  return (
    <div>
      <TooBar canvas={canvas} canvasReady={canvasReady} />
      <div className={styles.container} id='container'>
        <div className={styles.stencil_container} id="stencil_container"></div>
        <div className={styles.canvas_container} id="canvas_container"></div>
      </div>
      <div className={styles.miniMapContainer} id='mini_map'></div>
      <svg width="0" height="0">
        <defs>
          <filter id="filter-sketch">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.07"
              numOctaves="10"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="4"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
          </filter>
        </defs>
      </svg>
    </div>
  )
}

export default Editor