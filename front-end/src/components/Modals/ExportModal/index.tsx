import React, { useState } from 'react';
import { Modal, Input, Button, InputNumber, ColorPicker } from 'antd';
import type { Color } from 'antd/es/color-picker';
import styles from './index.module.less';

interface ExportModalProps {
  visible: boolean;
  onCancel: () => void;
  onExport: (data: ExportData) => void;
}

interface ExportData {
  fileName: string;
  fileType: string;
  imageConfig?: {
    padding: number;
    backgroundColor: string;
    quality?: number;
  };
}

const ExportModal: React.FC<ExportModalProps> = ({ visible, onCancel, onExport }) => {
  const [activeTab, setActiveTab] = useState('图片');
  const [fileType, setFileType] = useState('image');
  const [fileName, setFileName] = useState('');
  
  // 图片导出配置
  const [imagePadding, setImagePadding] = useState(20);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [imageQuality, setImageQuality] = useState(1);

  const handleExport = () => {
    const exportData: ExportData = {
      fileName,
      fileType,
    };

    // 如果是图片类型，添加图片配置
    if (fileType === 'image') {
      exportData.imageConfig = {
        padding: imagePadding,
        backgroundColor,
        quality: imageQuality,
      };
    }

    onExport(exportData);
  };

  const handleColorChange = (value: Color, hex: string) => {
    setBackgroundColor(hex);
  };

  const fileTypes = [
    { icon: '🖼️', name: '图片', value: 'image' },
    { icon: '🔠', name: 'SVG', value: 'svg' },
    { icon: '📑', name: 'PDF', value: 'pdf' },
    { icon: '📊', name: 'JSON', value: 'json' },
  ];

  // 预设颜色选项
  const presetColors = [
    '#ffffff', // 白色
    '#000000', // 黑色
    '#f5f5f5', // 浅灰色
    '#1890ff', // 蓝色
    '#52c41a', // 绿色
    '#faad14', // 橙色
    '#f5222d', // 红色
    '#722ed1', // 紫色
  ];

  const renderImageConfig = () => {
    if (activeTab !== '图片') return null;

    return (
      <>
        <div className={styles.formItem}>
          <div className={styles.label}>背景颜色</div>
          <div className={styles.description}>选择导出图片的背景颜色，支持透明度设置</div>
          <div className={styles.colorPickerWrapper}>
            <ColorPicker
              value={backgroundColor}
              onChange={handleColorChange}
              presets={[
                {
                  label: '常用颜色',
                  colors: presetColors,
                },
              ]}
              showText
              allowClear
              style={{ width: '40%' }}
            />
          </div>
        </div>

        <div className={styles.formItem}>
          <div className={styles.label}>边距 (px)</div>
          <div className={styles.description}>设置导出图片的内边距</div>
          <InputNumber
            value={imagePadding}
            onChange={(value) => setImagePadding(value || 0)}
            min={0}
            max={100}
            style={{ width: '100%' }}
            placeholder="请输入边距大小"
          />
        </div>

        <div className={styles.formItem}>
          <div className={styles.label}>图片质量</div>
          <div className={styles.description}>设置导出图片的质量 (0.1 - 1.0)</div>
          <InputNumber
            value={imageQuality}
            onChange={(value) => setImageQuality(value || 1)}
            min={0.1}
            max={1}
            step={0.1}
            style={{ width: '100%' }}
            placeholder="请输入图片质量"
          />
        </div>
      </>
    );
  };

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

          {renderImageConfig()}
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;
