import Canvas from './components/EditorCore'

declare global {
  interface Window {
    canvas: Canvas | null
  }
}