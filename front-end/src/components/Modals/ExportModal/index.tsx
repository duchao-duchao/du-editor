import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import styles from './index.module.less';

interface ExportModalProps {
  visible: boolean;
  onCancel: () => void;
  onExport: (data: ExportData) => void;
}

interface ExportData {
  fileName: string;
  fileType: string;
  format: string;
  horizontalPadding?: number;
  verticalPadding?: number;
  backgroundTransparent?: boolean;
  showFullBackground?: boolean;
  addWatermark?: boolean;
  watermarkText?: string;
}

const ExportModal: React.FC<ExportModalProps> = ({ visible, onCancel, onExport }) => {
  const [activeTab, setActiveTab] = useState('图片');
  const [fileType, setFileType] = useState('png');
  const [fileName, setFileName] = useState('');
  const [format, setFormat] = useState('PNG');
  const [horizontalPadding, setHorizontalPadding] = useState(10);
  const [verticalPadding, setVerticalPadding] = useState(10);
  const [backgroundTransparent, setBackgroundTransparent] = useState(false);
  const [showFullBackground, setShowFullBackground] = useState(true);
  const [addWatermark, setAddWatermark] = useState(false);
  const [watermarkText, setWatermarkText] = useState('');

  const handleExport = () => {
    onExport({
      fileName,
      fileType,
      format,
      horizontalPadding,
      verticalPadding,
      backgroundTransparent,
      showFullBackground,
      addWatermark,
      watermarkText,
    });
  };

  const fileTypes = [
    { icon: '🖼️', name: '图片', value: 'image' },
    { icon: '🔠', name: 'SVG', value: 'svg' },
    { icon: '📑', name: 'PDF', value: 'pdf' },
    { icon: '📊', name: 'JSON', value: 'json' },
  ];

  return (
    <Modal
      title="导出文件"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="export" type="primary" onClick={handleExport}>
          导出
        </Button>,
      ]}
      width={600}
    >
      <div className={styles.exportModal}>
        <div className={styles.leftPanel}>
          {fileTypes.map((type) => (
            <div
              key={type.value}
              className={`${styles.fileTypeItem} ${activeTab === type.name ? styles.active : ''}`}
              onClick={() => {
                setActiveTab(type.name);
                setFileType(type.value);
              }}
            >
              <div className={styles.fileTypeIcon}>{type.icon}</div>
              <div className={styles.fileTypeName}>{type.name}</div>
            </div>
          ))}
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.formItem}>
            <div className={styles.label}>导出文件名称</div>
            <Input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="请输入文件名称"
            />
          </div>

          {/* {activeTab === '图片' && (
            <>
              <div className={styles.formItem}>
                <div className={styles.label}>格式</div>
                <Radio.Group value={fileType} onChange={(e) => setFileType(e.target.value)}>
                  <Radio value="png">.png</Radio>
                </Radio.Group>
              </div>

              <div className={styles.formItem}>
                <div className={styles.label}>说明</div>
                <div className={styles.description}>
                  <Button type="primary" size="small">
                    常用图片格式，适合查看和分享
                  </Button>
                </div>
              </div>

              <div className={styles.formItem}>
                <div className={styles.label}>选项</div>
                <div className={styles.optionLabel}>格式</div>
                <Radio.Group value={format} onChange={(e) => setFormat(e.target.value)}>
                  <Radio value="PNG">PNG</Radio>
                </Radio.Group>
              </div>

              <div className={styles.formItem}>
                <div className={styles.optionLabel}>水平内边距</div>
                <InputNumber
                  value={horizontalPadding}
                  onChange={(value) => setHorizontalPadding(value as number)}
                  min={0}
                />
              </div>

              <div className={styles.formItem}>
                <div className={styles.optionLabel}>垂直内边距</div>
                <InputNumber
                  value={verticalPadding}
                  onChange={(value) => setVerticalPadding(value as number)}
                  min={0}
                />
              </div>

              <div className={styles.formItem}>
                <div className={styles.optionLabel}>底部添加文字</div>
                <Input
                  placeholder="比如: 来自simple-mind-map"
                  value={watermarkText}
                  onChange={(e) => {
                    setWatermarkText(e.target.value);
                    setAddWatermark(!!e.target.value);
                  }}
                />
              </div>

              <div className={styles.formItem}>
                <Checkbox
                  checked={backgroundTransparent}
                  onChange={(e) => setBackgroundTransparent(e.target.checked)}
                >
                  背景是否透明
                </Checkbox>
              </div>

              <div className={styles.formItem}>
                <Checkbox
                  checked={showFullBackground}
                  onChange={(e) => setShowFullBackground(e.target.checked)}
                >
                  是否显示完整背景图片（使用了背景图片时生效）
                </Checkbox>
              </div>
            </>
          )} */}
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;
