import Canvas from './index'

export default class Utils {
  canvas: Canvas

  constructor(props) {
    this.canvas = props.canvas
  }

  // 控制连接桩显示/隐藏
  showPorts(ports: NodeListOf<SVGElement>, show: boolean){
    for (let i = 0, len = ports.length; i < len; i += 1) {
      ports[i].style.visibility = show ? 'visible' : 'hidden'
    }
  }
}