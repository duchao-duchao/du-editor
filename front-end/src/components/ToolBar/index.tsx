import styles from './index.module.less'
import Canvas from '../EditorCore'

import { 
  BackIcon,
  ForwardIcon,
  DelIcon,
  ImportIcon,
  ExportIcon,
  FocusIcon,
  FontSizeIcon,
  FullScreenIcon,
  BacIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from '../../assets/svg/svgList' 

interface Props {
  canvas: React.RefObject<Canvas | null>
}

const ToolBar = (props: Props) => {
  const { canvas } = props

  return (
    <div className={styles.tooBar}>
      <div className={styles.left}>
        <div className={styles.operation} onClick={() => canvas.current?.graph.undo()}>
          <BackIcon width={18} height={18} />
        </div>
        <div className={styles.operation} onClick={() => canvas.current?.graph.redo()}>
          <ForwardIcon width={18} height={18} />
        </div>
        <div className={styles.operation} onClick={() => canvas.current?.graph.centerContent()}>
          <FocusIcon width={18} height={18} />
        </div>
        <div className={styles.line}></div>
        <div className={styles.operation}>
          <TextBoldIcon width={18} height={18} />
        </div>
        <div className={styles.operation}>
          <TextItalicIcon width={18} height={18} />
        </div>
        <div className={styles.operation}>
          <TextUnderlineIcon width={18} height={18} />
        </div>
        <div className={styles.operation}>
          <FontSizeIcon width={18} height={18} />
        </div>
        <div className={styles.operation}>
          <BacIcon width={18} height={18} />
        </div>
      </div>
      <div className={styles.right}>
        <div
          className={styles.operation}
          onClick={() => {
            canvas.current?.graph.getSelectedCells().forEach((cell) => {
              cell.remove()
            })
          }}
        >
          <DelIcon width={18} height={18} />
        </div>
          <div className={styles.operation}>
          <ImportIcon width={18} height={18} />
        </div>
        <div
          className={styles.operation}
          onClick={() => {
            if (canvas.current) {
              const data = canvas.current.graph.toJSON()
              const dataStr = JSON.stringify(data)
              const blob = new Blob([dataStr], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'canvas-data.json'
              a.click()
              URL.revokeObjectURL(url)
            }
          }}
        >
          <ExportIcon width={18} height={18} />
        </div>
        <div
          className={styles.operation}
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen()
            } else if (document.exitFullscreen) {
              document.exitFullscreen()
            }
          }}
        >
          <FullScreenIcon width={18} height={18} />
        </div>
      </div>
    </div>
  )
}

export default ToolBar