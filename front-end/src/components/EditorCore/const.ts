export const ports = {
  groups: {
    top: {
      position: 'top',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    right: {
      position: 'right',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    bottom: {
      position: 'bottom',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    left: {
      position: 'left',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
  },
  items: [
    {
      group: 'top',
    },
    {
      group: 'right',
    },
    {
      group: 'bottom',
    },
    {
      group: 'left',
    },
  ],
}

export const themesList = {
  skyblue: {
    name: '默认主题',
    grid: {
      visible: true,
      type: 'mesh',
      size: 8,
      color: '#e5e5e5',
      thickness: 1,
    },
    background: {
      color: '#ffffff',
    },
    nodeStyles: {
      stroke: '#1890ff',
      strokeWidth: 1,
      fill: '#f0f8ff',
      rx: 4,
      ry: 4,
    },
    edgeStyles: {
      stroke: '#1890ff',
      strokeWidth: 1,
      strokeDasharray: '',
    },
    textStyles: {
      fontSize: 12,
      fill: '#262626',
      fontFamily: 'Arial, sans-serif',
    }
  },
  sketch: {
    name: '手绘风格',
    grid: {
      visible: true,
      type: 'mesh',
      size: 15,
      color: '#f0f0f0',
      thickness: 1,
    },
    background: {
      color: '#fefefe',
    },
    nodeStyles: {
      stroke: '#2c3e50',
      strokeWidth: 2,
      fill: '#fff9e6',
      rx: 8,
      ry: 8,
    },
    edgeStyles: {
      stroke: '#34495e',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    textStyles: {
      fontSize: 13,
      fill: '#2c3e50',
      fontFamily: 'Comic Sans MS, cursive',
      fontWeight: 'bold',
    }
  },
  dark: {
    name: '深色主题',
    grid: {
      visible: true,
      type: 'mesh',
      size: 12,
      color: '#404040',
      thickness: 1,
    },
    background: {
      color: '#1e1e1e',
    },
    nodeStyles: {
      stroke: '#61dafb',
      strokeWidth: 1,
      fill: '#2d2d2d',
      rx: 6,
      ry: 6,
    },
    edgeStyles: {
      stroke: '#61dafb',
      strokeWidth: 1,
      strokeDasharray: '',
    },
    textStyles: {
      fontSize: 12,
      fill: '#ffffff',
      fontFamily: 'Arial, sans-serif',
    }
  },
  minimal: {
    name: '极简主题',
    grid: {
      visible: false,
      type: 'dot',
      size: 20,
      color: '#f5f5f5',
      thickness: 1,
    },
    background: {
      color: '#ffffff',
    },
    nodeStyles: {
      stroke: '#000000',
      strokeWidth: 1,
      fill: 'transparent',
      rx: 0,
      ry: 0,
    },
    edgeStyles: {
      stroke: '#000000',
      strokeWidth: 1,
      strokeDasharray: '',
    },
    textStyles: {
      fontSize: 11,
      fill: '#000000',
      fontFamily: 'Helvetica, Arial, sans-serif',
    }
  }
}