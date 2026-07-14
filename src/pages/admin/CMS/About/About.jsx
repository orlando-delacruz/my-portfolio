// src/pages/admin/CMS/About/About.jsx
import { memo, useState, useRef, useEffect } from 'react';
import { Form, Input, Button, message, Spin, Alert, Upload, Card, Row, Col, Select, InputNumber, Switch } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { useAboutAdmin, useUpdateAbout, uploadAboutImage } from '../../../../hooks/cms/useAbout';
import * as S from './About.styled';

const { TextArea } = Input;
const { Option } = Select;

const ICON_OPTIONS = [
  { value: 'FaUserFriends', label: '👥 User Friends' },
  { value: 'FaTooth', label: '🦷 Tooth' },
  { value: 'FaTag', label: '🏷️ Tag' },
  { value: 'FaClinicMedical', label: '🏥 Clinic' },
  { value: 'FaHeart', label: '❤️ Heart' },
  { value: 'FaAward', label: '🏆 Award' },
  { value: 'FaStar', label: '⭐ Star' },
  { value: 'FaUsers', label: '👥 Users' },
];

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
    // Update the ref with the current file list
    fileListRef.current = fileList;
  };

  const handleFinish = async (values) => {
    setSaving(true);
    try {
      let image = null;

      // Read the current file list from the ref
      const currentFileList = fileListRef.current;
      const newFile = currentFileList.find(f => f.originFileObj);
      if (newFile) {
        // User selected a new image – upload it
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
        // Keep existing image
        image = currentFileList[0].url;
      } else {
        // No image (fileList empty) – set to null
        image = null;
      }

      const features = (values.features || []).map((f, index) => ({
        title: f.title,
        icon: f.icon || null,
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

  // Build default file list from aboutData.image
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
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Card
                      key={field.key}
                      style={{ marginBottom: 16 }}
                      actions={[
                        <DeleteOutlined key="delete" onClick={() => remove(field.name)} />
                      ]}
                    >
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={6}>
                          <Form.Item
                            name={[field.name, 'title']}
                            fieldKey={[field.fieldKey, 'title']}
                            label="Title"
                            rules={[{ required: true, message: 'Title is required' }]}
                          >
                            <Input placeholder="e.g., Friendly Dental Team" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                          <Form.Item
                            name={[field.name, 'icon']}
                            fieldKey={[field.fieldKey, 'icon']}
                            label="Icon"
                          >
                            <Select placeholder="Select icon" allowClear>
                              {ICON_OPTIONS.map(opt => (
                                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                          <Form.Item
                            name={[field.name, 'display_order']}
                            fieldKey={[field.fieldKey, 'display_order']}
                            label="Display Order"
                          >
                            <InputNumber min={0} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                          <Form.Item
                            name={[field.name, 'is_active']}
                            fieldKey={[field.fieldKey, 'is_active']}
                            label="Active"
                            valuePropName="checked"
                          >
                            <Switch defaultChecked />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
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