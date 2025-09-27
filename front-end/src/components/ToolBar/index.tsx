import { Tooltip } from 'antd'

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
import ExportModal from '../Modals/ExportModal'
import { useState } from 'react'

interface Props {
  canvas: React.RefObject<Canvas | null>
}

const ToolBar = (props: Props) => {
  const { canvas } = props
  const [exportModalVisible, setExportModalVisible] = useState(false)

  return (
    <div className={styles.tooBar}>
      <div className={styles.left}>
        <div className={styles.operation} onClick={() => canvas.current?.graph.undo()}>
          <Tooltip title="撤销" placement="bottom">
            <BackIcon width={18} height={18} />
          </Tooltip>
        </div>
        <div className={styles.operation} onClick={() => canvas.current?.graph.redo()}>
          <Tooltip title="重做" placement="bottom">
            <ForwardIcon width={18} height={18} />
          </Tooltip>
        </div>
        <div className={styles.operation} onClick={() => canvas.current?.graph.centerContent()}>
          <Tooltip title="居中" placement="bottom">
            <FocusIcon width={18} height={18} />
          </Tooltip>
        </div>
        <div className={styles.line}></div>
        <div className={styles.operation}>
          <Tooltip title="加粗" placement="bottom">
            <TextBoldIcon width={18} height={18} />
          </Tooltip>
        </div>
        <div className={styles.operation}>
          <Tooltip title="斜体" placement="bottom">
            <TextItalicIcon width={18} height={18} />
          </Tooltip>
        </div>
        <div className={styles.operation}>
          <Tooltip title="下划线" placement="bottom">
            <TextUnderlineIcon width={18} height={18} />
          </Tooltip>
        </div>
        <div className={styles.operation}>
          <Tooltip title="字体大小" placement="bottom">
            <FontSizeIcon width={18} height={18} />
          </Tooltip>
        </div>
        <div className={styles.operation}>
          <Tooltip title="背景颜色" placement="bottom">
            <BacIcon width={18} height={18} />
          </Tooltip>
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
          <Tooltip title="删除" placement="bottom">
            <DelIcon width={18} height={18} />
          </Tooltip>
        </div>
          <div className={styles.operation}>
          <Tooltip title="导入" placement="bottom">
            <ImportIcon width={18} height={18} />
          </Tooltip>
        </div>
        <div
          className={styles.operation}
          onClick={() => {
            if (canvas.current) {
              setExportModalVisible(true)
              // const data = canvas.current.graph.toJSON()
              // const dataStr = JSON.stringify(data)
              // const blob = new Blob([dataStr], { type: 'application/json' })
              // const url = URL.createObjectURL(blob)
              // const a = document.createElement('a')
              // a.href = url
              // a.download = 'canvas-data.json'
              // a.click()
              // URL.revokeObjectURL(url)
            }
          }}
        >
          <Tooltip title="导出" placement="bottom">
            <ExportIcon width={18} height={18} />
          </Tooltip>
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
          <Tooltip title="全屏" placement="bottom">
            <FullScreenIcon width={18} height={18} />
          </Tooltip>
        </div>
      </div>

      <ExportModal
        visible={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        onExport={(data) => {
          setExportModalVisible(false)
          console.log(data)
        }}
      />
    </div>
  )
}

export default ToolBar