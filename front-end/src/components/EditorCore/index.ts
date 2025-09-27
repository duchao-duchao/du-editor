import { Graph, Shape } from '@antv/x6'
import { Stencil } from '@antv/x6-plugin-stencil'
import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history'

import Utils from './utils'
import { ports } from './const'

export default class Canvas {
  graph: Graph
  graphContainer: HTMLElement
  stencilContainer: HTMLElement
  utils: Utils
  stencil: Stencil

  constructor(props) {
    this.graphContainer = props.graphContainer
    this.stencilContainer = props.stencilContainer
    this.init()
  }

  init() {
    this.initGraph()
    this.initPlugin()
    this.bindEvent()
    this.registerNode()
    this.loadCustomNode()
  }

  initGraph() {
    this.graph = new Graph({
      container: this.graphContainer,
      grid: {
        visible: true,
        type: 'mesh',
        size: 16,
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
        connectionPoint: 'anchor',
        allowBlank: false,
        snap: {
          radius: 20,
        },
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                // stroke: '#A2B1C3',
                strokeWidth: 1,
                targetMarker: {
                  name: 'block',
                  width: 12,
                  height: 8,
                },
              },
            },
            zIndex: 0,
            tools: [
              {
                name: 'edge-editor',
              },
            ],
          })
        },
        validateConnection({ targetMagnet }) {
          return !!targetMagnet
        },
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
  }

  registerNode() {
    Graph.registerNode(
      'custom-rect',
      {
        inherit: 'rect',
        width: 66,
        height: 36,
        attrs: {
          body: {
            strokeWidth: 1,
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
                backgroundColor: '#EFF4FF',
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
        width: 66,
        height: 36,
        attrs: {
          body: {
            strokeWidth: 1,
          },
          text: {
            fontSize: 12,
            fill: '#262626',
          },
        },
        ports: {
          ...ports,
          items: [
            {
              group: 'top',
            },
            {
              group: 'bottom',
            },
          ],
        },
        tools: [
          {
            name: 'node-editor',
            args: {
              attrs: {
                backgroundColor: '#EFF4FF',
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
        width: 45,
        height: 45,
        attrs: {
          body: {
            strokeWidth: 1,
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
                backgroundColor: '#EFF4FF',
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
                backgroundColor: '#EFF4FF',
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
    const r1 = graph.createNode({
      shape: 'custom-rect',
      width: 30,
      height: 15,
      attrs: {
        body: {
          rx: 20,
          ry: 20,
        },
      },
    })
    const r2 = graph.createNode({
      shape: 'custom-rect',
      width: 30,
      height: 10,
    })
    const r3 = graph.createNode({
      shape: 'custom-rect',
      width: 30,
      height: 20,
      attrs: {
        body: {
          rx: 6,
          ry: 6,
        },
      },
    })
    const r4 = graph.createNode({
      shape: 'custom-polygon',
      width: 30,
      height: 15,
      attrs: {
        body: {
          refPoints: '0,10 10,0 20,10 10,20',
        },
      },
    })
    const r5 = graph.createNode({
      shape: 'custom-polygon',
      width: 30,
      height: 15,
      attrs: {
        body: {
          refPoints: '10,0 40,0 30,20 0,20',
        },
      },
    })
    const r6 = graph.createNode({
      shape: 'custom-circle',
      width: 30,
      height: 30,
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
        },
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
        },
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
        },
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
        },
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
        },
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
        },
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
        },
      },
    })

    // 创建分组
    stencil.load([r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13], 'group1')
  }
}