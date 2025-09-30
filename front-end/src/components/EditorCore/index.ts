import { Graph, Shape } from '@antv/x6'
import { Stencil } from '@antv/x6-plugin-stencil'
import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history'
import { Export } from '@antv/x6-plugin-export'
import { MiniMap } from '@antv/x6-plugin-minimap'

import Utils from './utils'
import { ports } from './const'
import ThemeManage from './theme'

export default class Canvas {
  graph: Graph
  graphContainer: HTMLElement
  stencilContainer: HTMLElement
  miniMapContainer: HTMLElement
  utils: Utils
  stencil: Stencil
  selectedNodeStyles: {
    fontSize?: number
    fontWeight?: string
    fontStyle?: string
    textDecoration?: string
    color?: string
    backgroundColor?: string
  } = {}
  themeManage: ThemeManage
  
  constructor(props) {
    this.graphContainer = props.graphContainer
    this.stencilContainer = props.stencilContainer
    this.miniMapContainer = props.miniMapContainer
    this.init()
  }

  init() {
    this.themeManage = new ThemeManage({ canvas: this })
    this.initGraph()
    this.initPlugin()
    this.bindEvent()
    this.registerNode()
    this.loadCustomNode()
  }

  initGraph() {
    const _this = this
    this.graph = new Graph({
      container: this.graphContainer,
      grid: {
        visible: true,
        type: 'mesh',
        size: 8,
      },
      panning: {
        enabled: true,
        eventTypes: ['leftMouseDown', 'mouseWheel'],
      },
      mousewheel: {
        enabled: true,
        zoomAtMousePosition: true,
        modifiers: 'ctrl',
        minScale: 0.2,
        maxScale: 10,
      },
      connecting: {
        router: 'manhattan',
        connector: {
          name: 'rounded',
          args: {
            radius: 8,
          },
        },
        anchor: 'center',
        connectionPoint: 'boundary',
        allowBlank: true,

        snap: {
          radius: 20,
        },
        allowEdge: true,
        allowNode: true,
        allowLoop: true,
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#A2B1C3',
                strokeWidth: 1,
                targetMarker: {
                  name: 'block',
                  width: 12,
                  height: 8,
                },
                ..._this.themeManage.themes[_this.themeManage.currentTheme].edgeStyles
              },
            },
            zIndex: 10,
            tools: [
              {
                name: 'edge-editor',
              },
            ],
          })
        },
        validateConnection({ targetCell, sourceCell }) {
          return true;
        },
        validateEdge: () => true,
        validateMagnet: () => true,
      },
      highlighting: {
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#5F95FF',
              stroke: '#5F95FF',
            },
          },
        },
      },
    })
  }

  initPlugin() {
    this.graph
      .use(
        new Transform({
          resizing: true,
          rotating: true,
        }),
      )
      .use(
        new Selection({
          rubberband: true,
          showNodeSelectionBox: true,
        }),
      )
      .use(new Snapline())
      .use(new Keyboard())
      .use(new Clipboard())
      .use(new History())
      .use(new Export())
      .use(
          new MiniMap({
            container: this.miniMapContainer,
          }),
        )
      

    this.utils = new Utils({ canvas: this })

    this.stencil = new Stencil({
      title: '图形库',
      target: this.graph,
      stencilGraphWidth: 250,
      stencilGraphHeight: 180,
      collapsable: true,
      groups: [
        {
          title: '基础图形',
          name: 'group1',
        },
      ],
      layoutOptions: {
        columns: 5,
        columnWidth: 45,
        rowHeight: 45,
      },
    })
    this.stencilContainer.appendChild(this.stencil.container)
    
    // 添加事件监听器，当节点从 stencil 拖拽到画布时，将其大小放大 2 倍
    this.graph.on('node:added', ({ node }) => {
      // 获取节点当前大小
      const width = node.getSize().width
      const height = node.getSize().height
      
      // 将节点大小放大 2 倍
      node.resize(width * 2, height * 2)
    })
  }

  bindEvent() {
    const { graph } = this
    
    // 添加选中事件监听
    graph.on('selection:changed', ({ selected }) => {
      this.updateSelectedNodeStyles(selected)
    })

    // 添加节点属性变化监听
    graph.on('cell:change:attrs', ({ cell }) => {
      const selectedCells = graph.getSelectedCells()
      if (selectedCells.includes(cell)) {
        this.updateSelectedNodeStyles(selectedCells)
      }
    })

    graph.bindKey(['meta+c', 'ctrl+c'], () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.copy(cells)
      }
      return false
    })
    graph.bindKey(['meta+x', 'ctrl+x'], () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.cut(cells)
      }
      return false
    })
    graph.bindKey(['meta+v', 'ctrl+v'], () => {
      if (!graph.isClipboardEmpty()) {
        const cells = graph.paste({ offset: 32 })
        graph.cleanSelection()
        graph.select(cells)
      }
      return false
    })

    // undo redo
    graph.bindKey(['meta+z', 'ctrl+z'], () => {
      if (graph.canUndo()) {
        graph.undo()
      }
      return false
    })
    graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
      if (graph.canRedo()) {
        graph.redo()
      }
      return false
    })

    // select all
    graph.bindKey(['meta+a', 'ctrl+a'], () => {
      const nodes = graph.getNodes()
      if (nodes) {
        graph.select(nodes)
      }
    })

    // delete
    graph.bindKey('backspace', () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.removeCells(cells)
      }
    })

    // zoom
    graph.bindKey(['ctrl+1', 'meta+1'], () => {
      const zoom = graph.zoom()
      if (zoom < 1.5) {
        graph.zoom(0.1)
      }
    })
    graph.bindKey(['ctrl+2', 'meta+2'], () => {
      const zoom = graph.zoom()
      if (zoom > 0.5) {
        graph.zoom(-0.1)
      }
    })

    graph.on('node:mouseenter', () => {
      const container = this.graphContainer
      const ports = container.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGElement>
      this.utils.showPorts(ports, true)
    })
    graph.on('node:mouseleave', () => {
      const container = this.graphContainer
      const ports = container.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGElement>
      this.utils.showPorts(ports, false)
    })

    // 右键菜单事件
    graph.on('cell:contextmenu', ({ cell, e }) => {
      e.preventDefault()
      this.showContextMenu(cell, e)
    })

    graph.on('blank:contextmenu', ({ e }) => {
      e.preventDefault()
      this.hideContextMenu()
    })

    // 点击其他地方隐藏菜单
    graph.on('cell:click', () => {
      this.hideContextMenu()
    })

    graph.on('blank:click', () => {
      this.hideContextMenu()
    })
  }

  // 显示右键菜单
  showContextMenu(cell: any, e: MouseEvent) {
    this.hideContextMenu() // 先隐藏之前的菜单
    
    const menuId = 'context-menu'
    const menu = document.createElement('div')
    menu.id = menuId
    menu.className = 'context-menu'
    menu.style.cssText = `
      position: fixed;
      top: ${e.clientY}px;
      left: ${e.clientX}px;
      background: white;
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 4px 0;
      z-index: 1000;
      min-width: 120px;
      font-size: 14px;
    `

    const menuItems = [
      {
        label: '复制',
        action: () => this.copyCell(cell),
        icon: '📋'
      },
      {
        label: '删除',
        action: () => this.deleteCell(cell),
        icon: '🗑️'
      },
      { type: 'divider' },
      {
        label: '上移一层',
        action: () => {
          cell.setZIndex(cell.getZIndex() + 1)
        },
        icon: '⬆️'
      },
      {
        label: '下移一层',
        action: () => {
          cell.setZIndex(cell.getZIndex() - 1)
        },
        icon: '⬇️'
      },
      {
        label: '置与顶部',
        action: () => this.moveToFront(cell),
        icon: '💟'
      },
      {
        label: '置与底部',
        action: () => this.moveToBack(cell),
        icon: '♎️'
      },
    ]

    menuItems.forEach(item => {
      if (item.type === 'divider') {
        const divider = document.createElement('div')
        divider.style.cssText = `
          height: 1px;
          background: #f0f0f0;
          margin: 4px 0;
        `
        menu.appendChild(divider)
      } else {
        const menuItem = document.createElement('div')
        menuItem.className = 'context-menu-item'
        menuItem.style.cssText = `
          padding: 8px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background-color 0.2s;
        `
        menuItem.innerHTML = `<span>${item.icon}</span><span>${item.label}</span>`
        
        menuItem.addEventListener('mouseenter', () => {
          menuItem.style.backgroundColor = '#f5f5f5'
        })
        
        menuItem.addEventListener('mouseleave', () => {
          menuItem.style.backgroundColor = 'transparent'
        })
        
        menuItem.addEventListener('click', () => {
          item.action()
          this.hideContextMenu()
        })
        
        menu.appendChild(menuItem)
      }
    })

    document.body.appendChild(menu)

    // 调整菜单位置，确保不超出屏幕
    const rect = menu.getBoundingClientRect()
    if (rect.right > window.innerWidth) {
      menu.style.left = `${e.clientX - rect.width}px`
    }
    if (rect.bottom > window.innerHeight) {
      menu.style.top = `${e.clientY - rect.height}px`
    }
  }

  // 隐藏右键菜单
  hideContextMenu() {
    const existingMenu = document.getElementById('context-menu')
    if (existingMenu) {
      existingMenu.remove()
    }
  }

  // 复制单元格
  copyCell(cell: any) {
    this.graph.select(cell)
    this.graph.copy([cell])
  }

  // 删除单元格
  deleteCell(cell: any) {
    this.graph.removeCell(cell)
  }

  // 置与顶部
  moveToFront(cell: any) {
    cell.toFront()
  }

  // 置与底部
  moveToBack(cell: any) {
    cell.toBack()
  }

  registerNode() {
    Graph.registerNode(
      'custom-rect',
      {
        inherit: 'rect',
        zIndex: 1,
        width: 66,
        height: 36,
        attrs: {
          body: {
            strokeWidth: 2,
            // magnet: true,
          },
          text: {
            fontSize: 12,
            fill: '#262626',
          },
        },
        ports: { ...ports },
        tools: [
          {
            name: 'node-editor',
            args: {
              attrs: {
                backgroundColor: 'transparent',
              },
            },
          },
        ],
      },
      true,
    )

    Graph.registerNode(
      'custom-polygon',
      {
        inherit: 'polygon',
        zIndex: 1,
        width: 66,
        height: 36,
        attrs: {
          body: {
            strokeWidth: 2,
          },
          text: {
            fontSize: 12,
            fill: '#262626',
          },
        },
        ports: {
          ...ports,
        },
        tools: [
          {
            name: 'node-editor',
            args: {
              attrs: {
                backgroundColor: 'transparent',
              },
            },
          },
        ],
      },
      true,
    )

    Graph.registerNode(
      'custom-circle',
      {
        inherit: 'circle',
        zIndex: 1,
        width: 45,
        height: 45,
        attrs: {
          body: {
            strokeWidth: 2,
          },
          text: {
            fontSize: 12,
            fill: '#262626',
          },
        },
        ports: { ...ports },
        tools: [
          {
            name: 'node-editor',
            args: {
              attrs: {
                backgroundColor: 'transparent',
              },
            },
          },
        ],
      },
      true,
    )

    Graph.registerNode(
      'custom-image',
      {
        inherit: 'rect',
        zIndex: 1,
        width: 52,
        height: 52,
        markup: [
          {
            tagName: 'rect',
            selector: 'body',
          },
          {
            tagName: 'image',
          },
          {
            tagName: 'text',
            selector: 'label',
          },
        ],
        attrs: {
          body: {
            // stroke: '#5F95FF',
            // fill: '#5F95FF',
          },
          image: {
            width: 26,
            height: 26,
            refX: 13,
            refY: 16,
          },
          label: {
            refX: 3,
            refY: 2,
            textAnchor: 'left',
            textVerticalAnchor: 'top',
            fontSize: 12,
            fill: '#fff',
          },
        },
        ports: { ...ports },
        tools: [
          {
            name: 'node-editor',
            args: {
              attrs: {
                backgroundColor: 'transparent',
              },
            },
          },
        ],
      },
      true,
    )
  }

  loadCustomNode() {
    const { stencil, graph } = this
    const theme = this.themeManage.themes[this.themeManage.currentTheme]
    
    const r1 = graph.createNode({
      shape: 'custom-rect',
      width: 30,
      height: 15,
      attrs: {
        body: {
          rx: 20,
          ry: 20,
          ...theme.nodeStyles,
        },
        label: {
          ...theme.textStyles,
        }
      },
    })

    const r2 = graph.createNode({
      shape: 'custom-rect',
      width: 30,
      height: 10,
      attrs: {
        body: {
          ...theme.nodeStyles,
        },
        label: {
          ...theme.textStyles,
        }
      },
    })
    const r3 = graph.createNode({
      shape: 'custom-rect',
      width: 30,
      height: 20,
      attrs: {
        body: {
          rx: 6,
          ry: 6,
          ...theme.nodeStyles,
        },
        label: {
          ...theme.textStyles,
        }
      },
    })
    const r4 = graph.createNode({
      shape: 'custom-polygon',
      width: 30,
      height: 15,
      attrs: {
        body: {
          refPoints: '0,10 10,0 20,10 10,20',
          ...theme.nodeStyles,
        },
        label: {
          ...theme.textStyles,
        }
      },
    })
    const r5 = graph.createNode({
      shape: 'custom-polygon',
      width: 30,
      height: 15,
      attrs: {
        body: {
          refPoints: '10,0 40,0 30,20 0,20',
          ...theme.nodeStyles,
        },
        label: {
          ...theme.textStyles,
        }
      },
    })
    const r6 = graph.createNode({
      shape: 'custom-circle',
      width: 30,
      height: 30,
      attrs: {
        body: {
          ...theme.nodeStyles,
        },
        label: {
          ...theme.textStyles,
        }
      },
    })
    
    // 新增图形
    // 椭圆形
    const r7 = graph.createNode({
      shape: 'custom-rect',
      width: 40,
      height: 20,
      attrs: {
        body: {
          rx: 20,
          ry: 10,
          ...theme.nodeStyles,
        },
        label: {
          ...theme.textStyles,
        }
      },
    })
    
    // 菱形
    const r8 = graph.createNode({
      shape: 'custom-polygon',
      width: 30,
      height: 30,
      attrs: {
        body: {
          refPoints: '15,0 30,15 15,30 0,15',
          ...theme.nodeStyles,
        },
        label: {
          ...theme.textStyles,
        }
      },
    })
    
    // 三角形
    const r9 = graph.createNode({
      shape: 'custom-polygon',
      width: 30,
      height: 30,
      attrs: {
        body: {
          refPoints: '15,0 30,30 0,30',
          ...theme.nodeStyles,
        },
        label: {
          ...theme.textStyles,
        }
      },
    })
    
    // 六边形
    const r10 = graph.createNode({
      shape: 'custom-polygon',
      width: 40,
      height: 30,
      attrs: {
        body: {
          refPoints: '10,0 30,0 40,15 30,30 10,30 0,15',
          ...theme.nodeStyles,
        },
        label: {
          ...theme.textStyles,
        }
      },
    })
    
    // 五角星
    const r11 = graph.createNode({
      shape: 'custom-polygon',
      width: 30,
      height: 30,
      attrs: {
        body: {
          refPoints: '15,0 18,10 30,10 20,17 24,30 15,22 6,30 10,17 0,10 12,10',
          ...theme.nodeStyles,
        },
        label: {
          ...theme.textStyles,
        }
      },
    })
    
    // 云形
    const r12 = graph.createNode({
      shape: 'custom-polygon',
      width: 40,
      height: 25,
      attrs: {
        body: {
          refPoints: '5,15 0,10 5,5 15,0 25,5 35,0 40,10 35,20 25,25 15,20',
          ...theme.nodeStyles,
        },
        label: {
          ...theme.textStyles,
        }
      },
    })
    
    // 流程图 - 文档
    const r13 = graph.createNode({
      shape: 'custom-polygon',
      width: 36,
      height: 18,
      attrs: {
        body: {
          refPoints: '0,0 60,0 60,20 30,30 0,20',
          ...theme.nodeStyles,
        },
        label: {
          ...theme.textStyles,
        }
      },
    })

    // 箭头 - 向左
    const r14 = graph.createNode({
      shape: 'custom-polygon',
      width: 40,
      height: 20,
      attrs: {
        body: {
          refPoints: '0,10 15,0 15,6 40,6 40,14 15,14 15,20',
          ...theme.nodeStyles,
        },
        label: {
          ...theme.textStyles,
        }
      },
    })

    // 箭头 - 向右
    const r15 = graph.createNode({
      shape: 'custom-polygon',
      width: 40,
      height: 20,
      attrs: {
        body: {
          refPoints: '0,6 25,6 25,0 40,10 25,20 25,14 0,14',
          ...theme.nodeStyles,
        },
        label: {
          ...theme.textStyles,
        }
      },
    })

    // 对话气泡（黑色描边，白底，左下尾巴）
    const r16 = graph.createNode({
      shape: 'custom-polygon',
      width: 40,
      height: 25,
      attrs: {
        body: {
          refPoints: '6,10 12,4 22,0 34,0 44,4 50,12 50,20 44,28 34,32 22,32 16,34 12,38 12,30 8,28 4,24 2,20 2,14',
          fill: '#ffffff',
          stroke: '#262626',
          ...theme.nodeStyles,
        },
        label: {
          ...theme.textStyles,
        }
      }
    })

    // 在创建分组后，为所有节点应用主题类名
    const allNodes = [r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16]
    // 创建分组
    stencil.load(allNodes, 'group1')
  }

  // 更新选中节点的样式信息
  updateSelectedNodeStyles(selectedCells: any[]) {
    if (selectedCells.length === 0) {
      this.selectedNodeStyles = {}
      return
    }

    // 如果选中多个节点，取第一个节点的样式作为默认值
    const firstCell = selectedCells[0]
    if (firstCell.isNode()) {
      const attrs = firstCell.getAttrs()
      // 根据节点类型获取相应的文本属性
      let labelAttrs = attrs.label
      let bodyAttrs = attrs.body


      this.selectedNodeStyles = {
        fontSize: labelAttrs?.fontSize || 12,
        fontWeight: labelAttrs?.fontWeight || 'normal',
        fontStyle: labelAttrs?.fontStyle || 'normal', 
        textDecoration: labelAttrs?.textDecoration || 'none',
        color: labelAttrs?.fill || '#262626',
        backgroundColor: bodyAttrs?.fill || 'transparent'
      }
    }
  }

  // 获取当前选中节点的样式信息
  getSelectedNodeStyles() {
    return this.selectedNodeStyles
  }

  // 应用样式到选中的节点
  applyStyleToSelectedNodes(styleKey: string, styleValue: any) {
    const selectedCells = this.graph.getSelectedCells()
    selectedCells.forEach((cell) => {
      if (cell.isNode()) {
        cell.attr(`label/${styleKey}`, styleValue)
      }
    })
   
    // 更新存储的样式信息
    this.selectedNodeStyles[styleKey] = styleValue
    this.updateSelectedNodeStyles(selectedCells)
  }
}