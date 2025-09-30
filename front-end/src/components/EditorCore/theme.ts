import { themesList } from './const'
import Canvas from './index'

export default class ThemeManage {
  canvas: Canvas
  // 主题配置
  themes = themesList
  currentTheme: string = 'minimal'
  sketchFlag: boolean = false

  constructor(props) {
    this.canvas = props.canvas
  }

  // 切换手绘风格
  switchSketch(flag: boolean) {
    this.sketchFlag = flag
    this.switchTheme(this.currentTheme)
  }

  // 切换主题
  switchTheme(themeName: string) {
    if (!this.themes[themeName]) {
      console.warn(`主题 ${themeName} 不存在`)
      return
    }

    this.currentTheme = themeName
    const theme = this.themes[themeName]
    if (this.sketchFlag) {
      theme.nodeStyles.filter = 'url(#filter-sketch)'
    } else {
      theme.nodeStyles.filter = ''
    }
    
    // 更新画布背景和网格
    this.updateCanvasTheme(theme)
    
    // 更新所有现有节点和边的样式
    this.updateExistingCellsTheme(theme)
    
    // 重新加载节点库以应用新主题
    this.canvas.loadCustomNode()
  }

  // 更新画布主题
  updateCanvasTheme(theme: any) {
    // 更新网格
    this.canvas.graph.setGridSize(theme.grid.size)
    this.canvas.graph.showGrid(theme.grid.visible)
    
    // 更新背景色
    this.canvas.graph.drawBackground({
      color: theme.background.color,
    })
    
    // 更新网格样式
    const gridContainer = this.canvas.graphContainer.querySelector('.x6-graph-grid')
    if (gridContainer) {
      const style = gridContainer.getAttribute('style') || ''
      const newStyle = style.replace(/stroke:[^;]+/g, `stroke:${theme.grid.color}`)
      gridContainer.setAttribute('style', newStyle)
    }
  }

  // 更新现有单元格主题
  updateExistingCellsTheme(theme: any) {
    const cells = this.canvas.graph.getCells()  
    
    cells.forEach(cell => {
      if (cell.isNode()) {
        // 更新节点样式
        cell.setAttrs({
          body: {
            ...theme.nodeStyles,
          },
          label: {
            ...theme.textStyles,
          }
        })
      } else if (cell.isEdge()) {
        // 更新边样式
        cell.setAttrs({
          line: {
            ...theme.edgeStyles,
          },
          label: {
            ...theme.textStyles,
          }
        })
      }
    })
  }

  // 获取当前主题
  getCurrentTheme() {
    return this.currentTheme
  }

  // 获取所有可用主题
  getAvailableThemes() {
    return Object.keys(this.themes).map(key => ({
      key,
      name: this.themes[key].name
    }))
  }

  // 应用主题到新创建的节点
  applyThemeToNode(node: any) {
    const theme = this.themes[this.currentTheme]
    node.setAttrs({
      body: {
        ...theme.nodeStyles,
      },
      label: {
        ...theme.textStyles,
      }
    })
  }

  // 应用主题到新创建的边
  applyThemeToEdge(edge: any) {
    const theme = this.themes[this.currentTheme]
    edge.setAttrs({
      line: {
        ...theme.edgeStyles,
      },
      label: {
        ...theme.textStyles,
      }
    })
  }
}