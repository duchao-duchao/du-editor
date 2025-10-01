import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined, PictureOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

interface ImageNodeProps {
  onImageUpload?: (imageUrl: string) => void;
  defaultImage?: string;
  width?: number;
  height?: number;
}

const ImageNode: React.FC<ImageNodeProps> = ({ 
  onImageUpload, 
  defaultImage,
}) => {
  const [imageUrl, setImageUrl] = useState<string>(defaultImage || '');
  const [loading, setLoading] = useState(false);

  const handleUpload: UploadProps['customRequest'] = (options) => {
    const { file } = options;
    setLoading(true);

    // 创建 FileReader 来读取图片文件
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageUrl(result);
      setLoading(false);
      
      // 通知父组件图片已上传
      if (onImageUpload) {
        onImageUpload(result);
      }
      
      message.success('图片上传成功');
    };
    
    reader.onerror = () => {
      setLoading(false);
      message.error('图片上传失败');
    };

    reader.readAsDataURL(file as File);
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
      return false;
    }
    
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能超过 5MB!');
      return false;
    }
    
    return true;
  };

  return (
    <div 
      style={{ 
        width: '100%',
        height: '100%',
        border: '1px dashed #d9d9d9',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#fafafa',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {imageUrl ? (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <img
            src={imageUrl}
            alt="uploaded"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '4px'
            }}
          />
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.3s',
            }}
            className="image-overlay"
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0';
            }}
          >
            <Upload
              customRequest={handleUpload}
              beforeUpload={beforeUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button 
                type="primary" 
                icon={<UploadOutlined />} 
                loading={loading}
                size="small"
              >
                更换图片
              </Button>
            </Upload>
          </div>
        </div>
      ) : (
        <Upload
          customRequest={handleUpload}
          beforeUpload={beforeUpload}
          showUploadList={false}
          accept="image/*"
        >
          <div style={{ textAlign: 'center', cursor: 'pointer' }}>
            <PictureOutlined style={{ fontSize: '24px', color: '#999', marginBottom: '8px' }} />
            <div style={{ color: '#999', fontSize: '12px' }}>
              {loading ? '上传中...' : '点击上传'}
            </div>
          </div>
        </Upload>
      )}
    </div>
  );
};

export default ImageNode;