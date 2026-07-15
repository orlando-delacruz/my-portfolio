// src/pages/admin/CMS/Gallery/Gallery.jsx
import { memo, useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  message,
  Spin,
  Alert,
  Upload,
  Tabs,
  Space,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import { Icon } from '@iconify/react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { useGalleryAdmin, useUpdateGallery, uploadGalleryImage } from '../../../../hooks/cms/useGallery';
import * as S from './Gallery.styled';

const { TextArea } = Input;
const { TabPane } = Tabs;

// Image item component
const ImageItem = ({ item, index, total, onDelete, onMoveUp, onMoveDown, isNew }) => {
  const src = isNew ? URL.createObjectURL(item.file) : item.image_url;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 8, border: '1px solid #f0f0f0', borderRadius: 8, marginBottom: 8 }}>
      <img src={src} alt="thumb" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 13, color: '#222' }}>{isNew ? item.file.name : item.image_url.split('/').pop()}</span>
      </div>
      <Space>
        <Tooltip title="Move up">
          <Button icon={<ArrowUpOutlined />} size="small" disabled={index === 0} onClick={() => onMoveUp(index)} />
        </Tooltip>
        <Tooltip title="Move down">
          <Button icon={<ArrowDownOutlined />} size="small" disabled={index === total - 1} onClick={() => onMoveDown(index)} />
        </Tooltip>
        <Button icon={<DeleteOutlined />} size="small" danger onClick={() => onDelete(index)} />
      </Space>
    </div>
  );
};

// Highlight item component with Iconify input + preview
const HighlightItem = ({ item, index, total, onDelete, onMoveUp, onMoveDown, onChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 8, border: '1px solid #f0f0f0', borderRadius: 8, marginBottom: 8 }}>
      <div style={{ flex: 1, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 200 }}>
          <Input
            placeholder="Iconify icon (e.g., mdi:tooth-outline)"
            value={item.icon || ''}
            onChange={(e) => onChange(index, 'icon', e.target.value)}
            style={{ flex: 1 }}
          />
          {item.icon && (
            <Icon icon={item.icon} style={{ fontSize: 24, color: '#886217', flexShrink: 0 }} />
          )}
        </div>
        <Input
          placeholder="Label"
          value={item.label || ''}
          onChange={(e) => onChange(index, 'label', e.target.value)}
          style={{ flex: 1, minWidth: 150 }}
        />
      </div>
      <Space>
        <Tooltip title="Move up">
          <Button icon={<ArrowUpOutlined />} size="small" disabled={index === 0} onClick={() => onMoveUp(index)} />
        </Tooltip>
        <Tooltip title="Move down">
          <Button icon={<ArrowDownOutlined />} size="small" disabled={index === total - 1} onClick={() => onMoveDown(index)} />
        </Tooltip>
        <Button icon={<DeleteOutlined />} size="small" danger onClick={() => onDelete(index)} />
      </Space>
    </div>
  );
};

const Gallery = () => {
  const { data: galleryData, isLoading, error, refetch } = useGalleryAdmin();
  const updateGallery = useUpdateGallery();
  const [form] = Form.useForm();

  const [state, setState] = useState({
    upImages: [],
    downImages: [],
    highlights: [],
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync state when galleryData loads – one-time initialization
  useEffect(() => {
    if (galleryData) {
      form.setFieldsValue({
        pre_title: galleryData.pre_title || '',
        title: galleryData.title || '',
        highlight_text: galleryData.highlight_text || '',
        description: galleryData.description || '',
      });

      const up = galleryData.images?.filter(img => img.gallery_position === 'up') || [];
      const down = galleryData.images?.filter(img => img.gallery_position === 'down') || [];

      // This is a one‑time sync; we suppress the linter warning.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({
        upImages: up.map(img => ({ ...img, isNew: false })),
        downImages: down.map(img => ({ ...img, isNew: false })),
        highlights: galleryData.highlights || [],
      });
    }
  }, [galleryData, form]);

  const { upImages, downImages, highlights } = state;

  const handleAddFiles = (position, files) => {
    const newItems = files.map(file => ({
      file,
      isNew: true,
      id: `temp-${Date.now()}-${Math.random()}`,
    }));
    if (position === 'up') {
      setState(prev => ({ ...prev, upImages: [...prev.upImages, ...newItems] }));
    } else {
      setState(prev => ({ ...prev, downImages: [...prev.downImages, ...newItems] }));
    }
  };

  const handleDeleteImage = (position, index) => {
    if (position === 'up') {
      setState(prev => {
        const newList = [...prev.upImages];
        const removed = newList.splice(index, 1)[0];
        if (removed.isNew && removed.file) {
          URL.revokeObjectURL(URL.createObjectURL(removed.file));
        }
        return { ...prev, upImages: newList };
      });
    } else {
      setState(prev => {
        const newList = [...prev.downImages];
        const removed = newList.splice(index, 1)[0];
        if (removed.isNew && removed.file) {
          URL.revokeObjectURL(URL.createObjectURL(removed.file));
        }
        return { ...prev, downImages: newList };
      });
    }
  };

  const handleMoveImage = (position, index, direction) => {
    const list = position === 'up' ? upImages : downImages;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === list.length - 1) return;
    setState(prev => {
      const listKey = position === 'up' ? 'upImages' : 'downImages';
      const currentList = [...prev[listKey]];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [currentList[index], currentList[swapIndex]] = [currentList[swapIndex], currentList[index]];
      return { ...prev, [listKey]: currentList };
    });
  };

  const handleAddHighlight = () => {
    setState(prev => ({
      ...prev,
      highlights: [...prev.highlights, { icon: '', label: '', isNew: true, id: `temp-${Date.now()}` }],
    }));
  };

  const handleDeleteHighlight = (index) => {
    setState(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const handleMoveHighlight = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === highlights.length - 1) return;
    setState(prev => {
      const newList = [...prev.highlights];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [newList[index], newList[swapIndex]] = [newList[swapIndex], newList[index]];
      return { ...prev, highlights: newList };
    });
  };

  const handleHighlightChange = (index, field, value) => {
    setState(prev => {
      const newList = [...prev.highlights];
      newList[index] = { ...newList[index], [field]: value };
      return { ...prev, highlights: newList };
    });
  };

  const getUploadProps = (position) => ({
    multiple: true,
    showUploadList: false,
    beforeUpload: (file) => {
      handleAddFiles(position, [file]);
      return false;
    },
    accept: 'image/*',
  });

  const handleFinish = async (values) => {
    setSaving(true);
    try {
      const allImages = [];

      for (let i = 0; i < upImages.length; i++) {
        const item = upImages[i];
        let imageUrl = item.image_url || null;
        if (item.isNew && item.file) {
          setUploading(true);
          try {
            imageUrl = await uploadGalleryImage(item.file);
          } catch (err) {
            message.error(err.message || 'Image upload failed');
            setUploading(false);
            setSaving(false);
            return;
          }
          setUploading(false);
        }
        allImages.push({
          image_url: imageUrl,
          gallery_position: 'up',
          is_active: true,
        });
      }

      for (let i = 0; i < downImages.length; i++) {
        const item = downImages[i];
        let imageUrl = item.image_url || null;
        if (item.isNew && item.file) {
          setUploading(true);
          try {
            imageUrl = await uploadGalleryImage(item.file);
          } catch (err) {
            message.error(err.message || 'Image upload failed');
            setUploading(false);
            setSaving(false);
            return;
          }
          setUploading(false);
        }
        allImages.push({
          image_url: imageUrl,
          gallery_position: 'down',
          is_active: true,
        });
      }

      const validHighlights = highlights
        .filter(h => h.label && h.label.trim() !== '')
        .map(h => ({
          icon: h.icon || null,
          label: h.label.trim(),
          is_active: true,
        }));

      const payload = {
        id: galleryData.id,
        pre_title: values.pre_title,
        title: values.title,
        highlight_text: values.highlight_text,
        description: values.description,
        is_active: true,
        images: allImages,
        highlights: validHighlights,
      };

      await updateGallery.mutateAsync(payload);
      message.success('Gallery section updated successfully');
      refetch();
    } catch (err) {
      console.error(err);
      message.error(err.message || 'Failed to update gallery section');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <S.LoadingContainer>
          <Spin size="large" />
        </S.LoadingContainer>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <S.Container>
          <Alert type="error" message="Failed to load gallery data" description={error.message} showIcon />
        </S.Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <S.Container>
        <S.Header>
          <S.Title>Gallery Section</S.Title>
          <S.Subtitle>Manage the gallery images and highlights displayed on your public homepage.</S.Subtitle>
        </S.Header>

        <S.Card>
          <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
            <S.SectionTitle>Gallery Content</S.SectionTitle>
            <Form.Item
              name="pre_title"
              label="Pre-title"
              rules={[{ required: true, message: 'Pre-title is required' }]}
            >
              <Input placeholder="e.g., Our Gallery" />
            </Form.Item>

            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Title is required' }]}
            >
              <Input placeholder="e.g., Leidi Bud Dentals " />
            </Form.Item>

            <Form.Item
              name="highlight_text"
              label="Highlight Text"
              rules={[{ required: true, message: 'Highlight text is required' }]}
            >
              <Input placeholder="e.g., Gallery" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Description is required' }]}
            >
              <TextArea placeholder="Describe your gallery..." rows={4} />
            </Form.Item>

            <S.SectionTitle>Gallery Images</S.SectionTitle>
            <Tabs defaultActiveKey="left" type="card">
              <TabPane tab="⬆️ Scroll Up Gallery" key="left">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Upload.Dragger {...getUploadProps('up')} style={{ padding: 20 }}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag images here</p>
                    <p className="ant-upload-hint">Supports multiple uploads</p>
                  </Upload.Dragger>
                  <div style={{ marginTop: 16 }}>
                    {upImages.map((item, index) => (
                      <ImageItem
                        key={item.id || index}
                        item={item}
                        index={index}
                        total={upImages.length}
                        onDelete={() => handleDeleteImage('up', index)}
                        onMoveUp={() => handleMoveImage('up', index, 'up')}
                        onMoveDown={() => handleMoveImage('up', index, 'down')}
                        isNew={item.isNew}
                      />
                    ))}
                    {upImages.length === 0 && <div style={{ padding: 16, textAlign: 'center', color: '#aaa' }}>No images in this gallery yet.</div>}
                  </div>
                </Space>
              </TabPane>

              <TabPane tab="⬇️ Scroll Down Gallery" key="right">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Upload.Dragger {...getUploadProps('down')} style={{ padding: 20 }}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag images here</p>
                    <p className="ant-upload-hint">Supports multiple uploads</p>
                  </Upload.Dragger>
                  <div style={{ marginTop: 16 }}>
                    {downImages.map((item, index) => (
                      <ImageItem
                        key={item.id || index}
                        item={item}
                        index={index}
                        total={downImages.length}
                        onDelete={() => handleDeleteImage('down', index)}
                        onMoveUp={() => handleMoveImage('down', index, 'up')}
                        onMoveDown={() => handleMoveImage('down', index, 'down')}
                        isNew={item.isNew}
                      />
                    ))}
                    {downImages.length === 0 && <div style={{ padding: 16, textAlign: 'center', color: '#aaa' }}>No images in this gallery yet.</div>}
                  </div>
                </Space>
              </TabPane>
            </Tabs>

            <S.SectionTitle>Highlights / Features</S.SectionTitle>
            <div style={{ marginBottom: 16 }}>
              {highlights.map((item, index) => (
                <HighlightItem
                  key={item.id || index}
                  item={item}
                  index={index}
                  total={highlights.length}
                  onDelete={() => handleDeleteHighlight(index)}
                  onMoveUp={() => handleMoveHighlight(index, 'up')}
                  onMoveDown={() => handleMoveHighlight(index, 'down')}
                  onChange={handleHighlightChange}
                />
              ))}
              <Button type="dashed" onClick={handleAddHighlight} icon={<PlusOutlined />} block>
                Add Highlight
              </Button>
            </div>

            <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" loading={saving || uploading}>
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </S.Card>
      </S.Container>
    </AdminLayout>
  );
};

export default memo(Gallery);