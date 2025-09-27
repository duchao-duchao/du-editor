import React, { useState } from 'react';
import { Modal, Button, Upload, message } from 'antd';
import styles from './index.module.less';

interface ImportModalProps {
  visible: boolean;
  onCancel: () => void;
  onImport: (data: ImportData) => void;
}

interface ImportData {
  json: JSON;
}

const ImportModal: React.FC<ImportModalProps> = ({ visible, onCancel, onImport }) => {
  const [json, setJson] = useState<JSON|undefined>()

  const handleImport = () => {
    if (json) {
      onImport({
        json
      });
    }
  };

  return (
    <Modal
      title="导入文件"
      open={visible}
      onCancel={onCancel}
      destroyOnHidden
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="import" type="primary" onClick={handleImport}>
          导入
        </Button>,
      ]}
      width={600}
    >
      <div className={styles.importModal}>
        <Upload
          accept=".json"
          maxCount={1}
          beforeUpload={() => false}
          onChange={(info) => {
            const file = info.file.originFileObj || info.file; // 拿到原始 File 对象
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                const json = JSON.parse(e.target?.result as string);
                setJson(json);
                message.success('JSON 格式正确');
              } catch (err) {
                message.error('JSON 格式错误');
              }
            };
            reader.readAsText(file);
          }}
        >
          <Button type='primary'>点击上传</Button>
        </Upload>
      </div>
    </Modal>
  );
};

export default ImportModal;
