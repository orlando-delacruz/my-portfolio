// src/pages/admin/CMS/About/About.jsx
import { memo, useState, useRef, useEffect } from 'react';
import { Form, Input, Button, message, Spin, Alert, Upload, Card, Row, Col, InputNumber, Switch, Space, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { useAboutAdmin, useUpdateAbout, uploadAboutImage } from '../../../../hooks/cms/useAbout';
import * as S from './About.styled';

const { TextArea } = Input;

// Helper: convert URL to UploadFile
const urlToUploadFile = (url) => {
  if (!url) return null;
  return {
    uid: '-1',
    name: url.split('/').pop() || 'image',
    status: 'done',
    url,
  };
};

// Feature item component with Iconify input + preview
const FeatureItem = ({ field, index, total, onDelete, onMoveUp, onMoveDown }) => {
  return (
    <Card style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Form.Item
            name={[field.name, 'icon']}
            fieldKey={[field.fieldKey, 'icon']}
            label="Icon"
            rules={[{ required: true, message: 'Icon is required' }]}
            style={{ marginBottom: 0 }}
          >
            <Input
              placeholder="Iconify icon (e.g., mdi:tooth-outline)"
              suffix={
                <Form.Item shouldUpdate={(prev, curr) => prev?.features?.[index]?.icon !== curr?.features?.[index]?.icon} noStyle>
                  {({ getFieldValue }) => {
                    const icon = getFieldValue(['features', index, 'icon']);
                    return icon ? <Icon icon={icon} style={{ fontSize: 20, color: '#886217' }} /> : null;
                  }}
                </Form.Item>
              }
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item
            name={[field.name, 'title']}
            fieldKey={[field.fieldKey, 'title']}
            label="Title"
            rules={[{ required: true, message: 'Title is required' }]}
            style={{ marginBottom: 0 }}
          >
            <Input placeholder="e.g., Modern Equipment" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item
            name={[field.name, 'display_order']}
            fieldKey={[field.fieldKey, 'display_order']}
            label="Display Order"
            style={{ marginBottom: 0 }}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item
            name={[field.name, 'is_active']}
            fieldKey={[field.fieldKey, 'is_active']}
            label="Active"
            valuePropName="checked"
            style={{ marginBottom: 0 }}
          >
            <Switch defaultChecked />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Space>
            <Tooltip title="Move up">
              <Button icon={<ArrowUpOutlined />} size="small" disabled={index === 0} onClick={onMoveUp} />
            </Tooltip>
            <Tooltip title="Move down">
              <Button icon={<ArrowDownOutlined />} size="small" disabled={index === total - 1} onClick={onMoveDown} />
            </Tooltip>
            <Button icon={<DeleteOutlined />} size="small" danger onClick={onDelete} />
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

const About = () => {
  const { data: aboutData, isLoading, error, refetch } = useAboutAdmin();
  const updateAbout = useUpdateAbout();
  const [form] = Form.useForm();

  // Ref to track the current file list from the Upload component
  const fileListRef = useRef([]);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Populate form when aboutData loads
  useEffect(() => {
    if (aboutData) {
      form.setFieldsValue({
        pre_title: aboutData.pre_title || '',
        title: aboutData.title || '',
        accent_text: aboutData.accent_text || '',
        description: aboutData.description || '',
        features: aboutData.features || [],
      });
    }
  }, [aboutData, form]);

  const handleImageChange = ({ fileList }) => {
    fileListRef.current = fileList;
  };

  const handleFinish = async (values) => {
    setSaving(true);
    try {
      let image = null;

      const currentFileList = fileListRef.current;
      const newFile = currentFileList.find(f => f.originFileObj);
      if (newFile) {
        setUploading(true);
        try {
          image = await uploadAboutImage(newFile.originFileObj);
        } catch (uploadErr) {
          message.error(uploadErr.message || 'Image upload failed');
          setUploading(false);
          setSaving(false);
          return;
        }
        setUploading(false);
      } else if (currentFileList.length > 0 && currentFileList[0].url) {
        image = currentFileList[0].url;
      } else {
        image = null;
      }

      const features = (values.features || []).map((f, index) => ({
        icon: f.icon || null,
        title: f.title,
        display_order: f.display_order !== undefined ? f.display_order : index,
        is_active: f.is_active !== undefined ? f.is_active : true,
      }));

      const payload = {
        id: aboutData.id,
        pre_title: values.pre_title,
        title: values.title,
        accent_text: values.accent_text,
        description: values.description,
        image,
        is_active: true,
        features,
      };

      await updateAbout.mutateAsync(payload);
      message.success('About section updated successfully');
      refetch();
    } catch (err) {
      console.error(err);
      message.error(err.message || 'Failed to update about section');
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
          <Alert type="error" message="Failed to load about data" description={error.message} showIcon />
        </S.Container>
      </AdminLayout>
    );
  }

  const defaultFileList = aboutData?.image ? [urlToUploadFile(aboutData.image)].filter(Boolean) : [];

  return (
    <AdminLayout>
      <S.Container>
        <S.Header>
          <S.Title>About Section</S.Title>
          <S.Subtitle>Manage the about section content displayed on your public homepage.</S.Subtitle>
        </S.Header>

        <S.Card>
          <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
            <S.SectionTitle>About Content</S.SectionTitle>
            <Form.Item
              name="pre_title"
              label="Pre-title"
              rules={[{ required: true, message: 'Pre-title is required' }]}
            >
              <Input placeholder="e.g., About Our Clinic" />
            </Form.Item>

            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Title is required' }]}
            >
              <Input placeholder="e.g., Comfortable Dental Care" />
            </Form.Item>

            <Form.Item
              name="accent_text"
              label="Accent Text"
              rules={[{ required: true, message: 'Accent text is required' }]}
            >
              <Input placeholder="e.g., You Can Trust" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Description is required' }]}
            >
              <TextArea placeholder="Describe your clinic..." rows={4} />
            </Form.Item>

            <S.SectionTitle>About Image</S.SectionTitle>
            <Form.Item
              label="Image"
              rules={[
                {
                  validator: () => {
                    const currentFileList = fileListRef.current;
                    if (currentFileList.length === 0 && !aboutData?.image) {
                      return Promise.reject(new Error('Please upload an image.'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <S.ImageUploadWrapper>
                <Upload
                  listType="picture-card"
                  defaultFileList={defaultFileList}
                  onChange={handleImageChange}
                  beforeUpload={() => false}
                  accept="image/*"
                  maxCount={1}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
                {uploading && <div style={{ marginTop: 4, color: '#1890ff' }}>Uploading...</div>}
                <div style={{ marginTop: 4, fontSize: 12, color: '#888' }}>
                  Supported: PNG, JPG, JPEG, WEBP (Max 5MB)
                </div>
              </S.ImageUploadWrapper>
            </Form.Item>

            <S.SectionTitle>Features</S.SectionTitle>
            <Form.List name="features">
              {(fields, { add, move, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <FeatureItem
                      key={field.key}
                      field={field}
                      index={index}
                      total={fields.length}
                      onDelete={() => remove(field.name)}
                      onMoveUp={() => move(index, index - 1)}
                      onMoveDown={() => move(index, index + 1)}
                    />
                  ))}
                  <Button type="dashed" onClick={() => add({ icon: '', title: '', display_order: 0, is_active: true })} icon={<PlusOutlined />} block>
                    Add Feature
                  </Button>
                </>
              )}
            </Form.List>

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

export default memo(About);