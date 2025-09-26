import styles from './index.module.less'

const ToolBar = () => {
  return (
    <div className={styles.tooBar}>
      <div className={styles.operation}>撤销</div>
      <div>恢复</div>
      <div>撤销</div>
      <div>撤销</div>
      <div>撤销</div>
      <div>撤销</div>
    </div>
  )
}

export default ToolBar