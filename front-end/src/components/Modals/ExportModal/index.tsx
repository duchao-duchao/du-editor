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
}

const ExportModal: React.FC<ExportModalProps> = ({ visible, onCancel, onExport }) => {
  const [activeTab, setActiveTab] = useState('图片');
  const [fileType, setFileType] = useState('image');
  const [fileName, setFileName] = useState('');

  const handleExport = () => {
    onExport({
      fileName,
      fileType,
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
      destroyOnHidden
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
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;
