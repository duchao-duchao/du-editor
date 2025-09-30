import { message, Tooltip, InputNumber, Popover, Switch } from 'antd'
import { useState, useEffect } from 'react'

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
  CengjiIcon,
  ThemeIcon,
} from '../../assets/svg/svgList' 
import ExportModal from '../Modals/ExportModal'
import ImportModal from '../Modals/ImportModal'
import ColorPickerComponent from '../Color'
import theme1Image from '../../assets/images/theme1.png'
import theme2Image from '../../assets/images/theme2.png'
import theme3Image from '../../assets/images/theme3.png'
import theme4Image from '../../assets/images/theme4.png'

interface Props {
  canvas: React.RefObject<Canvas | null>
  canvasReady?: boolean
}

const ToolBar = (props: Props) => {
  const { canvas, canvasReady } = props
  const [exportModalVisible, setExportModalVisible] = useState(false)
  const [importModalVisible, setImportModalVisible] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  
  // 添加状态来跟踪当前选中节点的样式
  const [selectedStyles, setSelectedStyles] = useState({
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    color: '#262626',
    backgroundColor: 'transparent'
  })

  // 监听选中节点变化
  useEffect(() => {
    if (canvasReady && canvas.current?.graph) {
      const graph = canvas.current.graph
      
      const handleSelectionChange = () => {
        const styles = canvas.current?.getSelectedNodeStyles() || {}
        setSelectedStyles({...selectedStyles, ...styles})
      }

      // 监听选中变化事件
      graph.on('selection:changed', handleSelectionChange)
      graph.on('cell:change:attrs', handleSelectionChange)

      return () => {
        graph.off('selection:changed', handleSelectionChange)
        graph.off('cell:change:attrs', handleSelectionChange)
      }
    }
  }, [canvas, canvasReady])

  return (
    <div className={styles.tooBar}>
      <div className={styles.left}>
        <Tooltip title="撤销" placement="bottom">
          <div className={styles.operation} onClick={() => canvas.current?.graph.undo()}>
            <BackIcon width={18} height={18} />
          </div>
        </Tooltip>
        <Tooltip title="重做" placement="bottom">
          <div className={styles.operation} onClick={() => canvas.current?.graph.redo()}>
            <ForwardIcon width={18} height={18} />
          </div>
        </Tooltip>
        <Tooltip title="居中" placement="bottom">
          <div className={styles.operation} onClick={() => {
            // canvas.current?.graph.centerContent()
            canvas.current?.graph.zoomToFit({ padding: 20, maxScale: 1 })
          }}>
            <FocusIcon width={18} height={18} />
          </div>
        </Tooltip>
        <div className={styles.line}></div>
        <Tooltip title="加粗" placement="bottom">
          <div
            className={styles.operation}
            onClick={() => {
              const currentStyles = canvas.current?.getSelectedNodeStyles() || {}
              const newWeight = currentStyles.fontWeight === 'bold' ? 'normal' : 'bold'
              canvas.current?.applyStyleToSelectedNodes('fontWeight', newWeight)
            }}
          >
            <TextBoldIcon 
              width={16} 
              height={16} 
              style={{ 
                color: selectedStyles.fontWeight === 'bold' ? '#1890ff' : 'inherit' 
              }}
            />
          </div>
        </Tooltip>
        <Tooltip title="斜体" placement="bottom">
          <div
            className={styles.operation}
            onClick={() => {
              const currentStyles = canvas.current?.getSelectedNodeStyles() || {}
              const newStyle = currentStyles.fontStyle === 'italic' ? 'normal' : 'italic'
              canvas.current?.applyStyleToSelectedNodes('fontStyle', newStyle)
            }}
          >
            <TextItalicIcon 
              width={16} 
              height={16}
              style={{ 
                color: selectedStyles.fontStyle === 'italic' ? '#1890ff' : 'inherit' 
              }}
            />
          </div>
        </Tooltip>
        <Tooltip title="下划线" placement="bottom">
          <div
            className={styles.operation}
            onClick={() => {
              const currentStyles = canvas.current?.getSelectedNodeStyles() || {}
              const newDecoration = currentStyles.textDecoration === 'underline' ? 'none' : 'underline'
              canvas.current?.applyStyleToSelectedNodes('textDecoration', newDecoration)
            }}
          >
            <TextUnderlineIcon 
              width={16} 
              height={16}
              style={{ 
                color: selectedStyles.textDecoration === 'underline' ? '#1890ff' : 'inherit' 
              }}
            />
          </div>
        </Tooltip>
        <Tooltip title="字体大小" placement="bottom">
          <div className={styles.operation}>
            <InputNumber
              min={8}
              max={100}
              value={selectedStyles.fontSize}
              style={{ width: 60, height: 32 }}
              onChange={(value) => {
                if (value) {
                  canvas.current?.applyStyleToSelectedNodes('fontSize', value)
                }
              }}
            />
          </div>
        </Tooltip>
        <Tooltip title="字体颜色" placement="bottom">
          <div className={styles.operation}>
            <div className={styles.colorPickerWrapper}>
              <FontSizeIcon width={14} height={14} />
              <ColorPickerComponent
                defaultValue={selectedStyles.color}
                onChange={(color) => {
                  canvas.current?.graph?.getSelectedCells().forEach((cell) => {
                    cell.attr('label/fill', color.toCssString())
                  })
                }}
              />
            </div>
          </div>
        </Tooltip>
        <Tooltip title="背景颜色" placement="bottom">
          <div className={styles.operation}>
            <div className={styles.colorPickerWrapper}>
              <BacIcon width={16} height={16} />
              <ColorPickerComponent
                defaultValue={selectedStyles.backgroundColor}
                onChange={(color) => {
                  canvas.current?.graph?.getSelectedCells().forEach((cell) => {
                    cell.attr('body/fill', color.toCssString())
                  })
                }}
              />
            </div>
          </div>
        </Tooltip>
        <Popover
            placement="bottom"
            content={
              <div>
                <div className={styles.operationItem} onClick={() => canvas.current?.graph?.getSelectedCells().forEach((cell) => cell.setZIndex(cell.getZIndex() + 1))}>
                  ⬆️ 上移一层
                </div>
                <div className={styles.operationItem} onClick={() => canvas.current?.graph?.getSelectedCells().forEach((cell) => cell.setZIndex(cell.getZIndex() - 1))}>
                  ⬇️ 下移一层
                </div>
                <div className={styles.operationItem} onClick={() => canvas.current?.graph?.getSelectedCells().forEach((cell) => cell.toFront())}>
                  💟 置与顶部
                </div>
                <div className={styles.operationItem} onClick={() => canvas.current?.graph?.getSelectedCells().forEach((cell) => cell.toBack())}>
                  ♎️ 置与底部
                </div>
              </div>
            }
          >
          <div className={styles.operation}>
            <CengjiIcon width={18} height={18} />
          </div>
        </Popover>
      </div>
      <div className={styles.right}>
        <Switch checkedChildren='手绘模式' onChange={(e) =>canvas.current?.themeManage.switchSketch(e)} unCheckedChildren='关闭手绘' />
        <Popover
          placement="bottom"
          content={
            <div className={styles.themeList}>
              <div className={styles.operationItem} onClick={() => canvas.current?.themeManage.switchTheme('skyblue')}>
                <img className={styles.themeImage} src={theme2Image} alt="" />
              </div>
              <div className={styles.operationItem} onClick={() => canvas.current?.themeManage.switchTheme('minimal')}>
                <img className={styles.themeImage} src={theme1Image} alt="" />
              </div>
              <div className={styles.operationItem} onClick={() => canvas.current?.themeManage.switchTheme('dark')}>
                <img className={styles.themeImage} src={theme3Image} alt="" />
              </div>
              <div className={styles.operationItem} onClick={() => canvas.current?.themeManage.switchTheme('sketch')}>
                <img className={styles.themeImage} src={theme4Image} alt="" />
              </div>
            </div>
          }
        >
          <div className={styles.operation}>
            <ThemeIcon width={18} height={18} />
          </div>
        </Popover>
        <Tooltip title="删除" placement="bottom">
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
        </Tooltip>
        <Tooltip title="导入" placement="bottom">
          <div className={styles.operation} onClick={() => setImportModalVisible(true)}>
            <ImportIcon width={18} height={18} />
          </div>
        </Tooltip>
        <Tooltip title="导出" placement="bottom">
          <div
            className={styles.operation}
            onClick={() => {
              if (canvas.current) {
                setExportModalVisible(true)
              }
            }}
          >
            <ExportIcon width={18} height={18} />
          </div>
        </Tooltip>
        <Tooltip title="全屏" placement="bottom">
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
        </Tooltip>
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