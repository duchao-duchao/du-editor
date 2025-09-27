import { message, Tooltip, InputNumber } from 'antd'
import { useState } from 'react'

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
import ImportModal from '../Modals/ImportModal'
import ColorPickerComponent from '../Color'

interface Props {
  canvas: React.RefObject<Canvas | null>
}

const ToolBar = (props: Props) => {
  const { canvas } = props
  const [exportModalVisible, setExportModalVisible] = useState(false)
  const [importModalVisible, setImportModalVisible] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

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
        <div
          className={styles.operation}
          onClick={() => {
            canvas.current?.graph?.getSelectedCells().forEach((cell) => {
              const currentWeight = cell.attr('label/fontWeight') || 'normal';
              cell.attr('label/fontWeight', currentWeight === 'bold' ? 'normal' : 'bold');
            })
          }}
        >
          <Tooltip title="加粗" placement="bottom">
            <TextBoldIcon width={16} height={16} />
          </Tooltip>
        </div>
        <div
          className={styles.operation}
          onClick={() => {
            canvas.current?.graph?.getSelectedCells().forEach((cell) => {
              const currentStyle = cell.attr('label/fontStyle') || 'normal';
              cell.attr('label/fontStyle', currentStyle === 'italic' ? 'normal' : 'italic');
            })
          }}
        >
          <Tooltip title="斜体" placement="bottom">
            <TextItalicIcon width={16} height={16} />
          </Tooltip>
        </div>
        <div
          className={styles.operation}
          onClick={() => {
            canvas.current?.graph?.getSelectedCells().forEach((cell) => {
              const currentStyle = cell.attr('label/textDecoration') || 'normal';
              cell.attr('label/textDecoration', currentStyle === 'underline' ? 'normal' : 'underline');
            })
          }}
        >
          <Tooltip title="下划线" placement="bottom">
            <TextUnderlineIcon width={16} height={16} />
          </Tooltip>
        </div>
        <div className={styles.operation}>
          <Tooltip title="字体大小" placement="bottom">
            <InputNumber
              min={8}
              max={100}
              size='small'
              style={{ width: 60 }}
              onChange={(value) => {
                canvas.current?.graph?.getSelectedCells().forEach((cell) => {
                  cell.attr('label/fontSize', value)
                })
              }}
            />
          </Tooltip>
        </div>
        <div className={styles.operation}>
          <Tooltip title="字体颜色" placement="bottom">
            <div className={styles.colorPickerWrapper}>
              <FontSizeIcon width={14} height={14} />
              <ColorPickerComponent
                onChange={(color) => {
                  canvas.current?.graph?.getSelectedCells().forEach((cell) => {
                    cell.attr('label/fill', color.toCssString())
                  })
                }}
              />
            </div>
          </Tooltip>
        </div>
        <div
          className={styles.operation}
          onClick={() => {
            canvas.current?.graph?.getSelectedCells().forEach((cell) => {
              const currentColor = cell.attr('label/backgroundColor') || 'normal';
              cell.attr('label/backgroundColor', currentColor === 'normal' ? 'red' : 'normal');
            })
          }}
        >
          <Tooltip title="背景颜色" placement="bottom">
            <div className={styles.colorPickerWrapper}>
              <BacIcon width={16} height={16} />
              <ColorPickerComponent
                onChange={(color) => {
                  canvas.current?.graph?.getSelectedCells().forEach((cell) => {
                    cell.attr('body/fill', color.toCssString())
                  })
                }}
              />
            </div>
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
        <div className={styles.operation} onClick={() => setImportModalVisible(true)}>
          <Tooltip title="导入" placement="bottom">
            <ImportIcon width={18} height={18} />
          </Tooltip>
        </div>
        <div
          className={styles.operation}
          onClick={() => {
            if (canvas.current) {
              setExportModalVisible(true)
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
          const area = canvas.current?.graph.getGraphArea(); // 实际内容区域
          const scale = Math.min(1200 / area?.width, 800 / area?.height); // 缩放比例
          const width = area.width * scale
          const height = area.height * scale
          if (data.fileType === 'image') {
            canvas.current?.graph.exportPNG(data.fileName, { width, height, quality: 1, padding: 20 })
          }
          if (data.fileType === 'svg') {
            canvas.current?.graph.exportSVG(data.fileName, { preserveDimensions: true })
          }
          if (data.fileType === 'pdf') {
            // canvas.current?.graph.toPDF()
          }
          if (data.fileType === 'json') {
            const graphData = canvas.current?.graph.toJSON()
            const dataStr = JSON.stringify(graphData)
            const blob = new Blob([dataStr], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${data?.fileName}.json`
            a.click()
            URL.revokeObjectURL(url)
            a.remove()
          }
        }}
      />

      <ImportModal
        visible={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        onImport={(data) => {
          if (data.json) {
            canvas.current?.graph.fromJSON(data?.json)
            setImportModalVisible(false)
            messageApi.success('导入成功')
          }
        }}
      />
      {contextHolder}
    </div>
  )
}

export default ToolBar