// src/pages/admin/CMS/Hero/Hero.jsx
import { memo, useState, useEffect } from 'react';
import { Form, Input, Button, message, Spin, Alert, Upload, Card, Row, Col, Select, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { useHeroAdmin, useUpdateHero, uploadHeroImage } from '../../../../hooks/cms/useHero';
import * as S from './Hero.styled';

const { TextArea } = Input;
const { Option } = Select;

const ICON_OPTIONS = [
  { value: 'FaAward', label: '🏆 Award' },
  { value: 'FaStar', label: '⭐ Star' },
  { value: 'FaUsers', label: '👥 Users' },
];

// Helper: convert a URL to an UploadFile object
const urlToUploadFile = (url) => {
  if (!url) return null;
  return {
    uid: '-1',
    name: url.split('/').pop() || 'image',
    status: 'done',
    url,
  };
};

const Hero = () => {
  const { data: heroData, isLoading, error, refetch } = useHeroAdmin();
  const updateHero = useUpdateHero();
  const [form] = Form.useForm();

  // User‑selected file (new upload) or removal flag
  const [selectedFile, setSelectedFile] = useState(null);
  const [isRemoved, setIsRemoved] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Derive fileList and imagePreview directly from state + heroData (no useMemo needed – cheap computations)
  const fileList = (() => {
    if (selectedFile) {
      return [
        {
          uid: '-2',
          name: selectedFile.name,
          status: 'done',
          originFileObj: selectedFile,
        },
      ];
    }
    if (isRemoved) {
      return [];
    }
    if (heroData?.hero_image) {
      const file = urlToUploadFile(heroData.hero_image);
      return file ? [file] : [];
    }
    return [];
  })();

  const imagePreview = (() => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }
    if (isRemoved) {
      return null;
    }
    return heroData?.hero_image || null;
  })();

  // Cleanup blob URL when it changes
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Populate form with hero data (safe – external system update)
  useEffect(() => {
    if (heroData) {
      form.setFieldsValue({
        bio_badge: heroData.bio_badge || '',
        heading: heroData.heading || '',
        highlight_text: heroData.highlight_text || '',
        subheading: heroData.subheading || '',
        primary_button_text: heroData.primary_button_text || '',
        primary_button_link: heroData.primary_button_link || '',
        cards: heroData.cards || [],
      });
    }
  }, [heroData, form]);

  const handleImageChange = ({ file }) => {
    // file.status === 'removed' when user clicks remove icon
    if (file.status === 'removed') {
      setSelectedFile(null);
      setIsRemoved(true);
      return;
    }

    const fileObj = file.originFileObj || file;
    if (fileObj instanceof File) {
      setSelectedFile(fileObj);
      setIsRemoved(false);
    }
  };

  const handleFinish = async (values) => {
    setSaving(true);
    try {
      let heroImage = null;

      if (isRemoved) {
        // User explicitly removed the image
        heroImage = null;
      } else if (selectedFile) {
        // User selected a new image – upload it
        setUploading(true);
        try {
          heroImage = await uploadHeroImage(selectedFile);
        } catch (uploadErr) {
          message.error(uploadErr.message || 'Image upload failed');
          setUploading(false);
          setSaving(false);
          return;
        }
        setUploading(false);
      } else {
        // Keep existing image if any
        heroImage = heroData?.hero_image || null;
      }

      const cards = (values.cards || []).map((card, index) => ({
        title: card.title,
        value: card.value,
        icon: card.icon || null,
        display_order: card.display_order !== undefined ? card.display_order : index,
        is_active: true,
      }));

      const payload = {
        id: heroData.id,
        bio_badge: values.bio_badge,
        heading: values.heading,
        highlight_text: values.highlight_text,
        subheading: values.subheading,
        primary_button_text: values.primary_button_text,
        primary_button_link: values.primary_button_link,
        hero_image: heroImage,
        is_active: true,
        cards,
      };

      await updateHero.mutateAsync(payload);
      message.success('Hero section updated successfully');

      // Reset user actions after successful save
      setSelectedFile(null);
      setIsRemoved(false);

      refetch();
    } catch (err) {
      console.error(err);
      message.error(err.message || 'Failed to update hero section');
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
          <Alert type="error" message="Failed to load hero data" description={error.message} showIcon />
        </S.Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <S.Container>
        <S.Header>
          <S.Title>Hero Section</S.Title>
          <S.Subtitle>Manage the hero section content displayed on your public homepage.</S.Subtitle>
        </S.Header>

        <S.Card>
          <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
            <S.SectionTitle>Hero Content</S.SectionTitle>
            <Form.Item
              name="bio_badge"
              label="Bio Badge"
              rules={[{ required: true, message: 'Bio badge is required' }]}
            >
              <Input placeholder="e.g., Trusted Dental Clinic" />
            </Form.Item>

            <Form.Item
              name="heading"
              label="Heading"
              rules={[{ required: true, message: 'Heading is required' }]}
            >
              <Input placeholder="e.g., Healthy Smiles" />
            </Form.Item>

            <Form.Item
              name="highlight_text"
              label="Highlight Text"
              rules={[{ required: true, message: 'Highlight text is required' }]}
            >
              <Input placeholder="e.g., Start Here" />
            </Form.Item>

            <Form.Item
              name="subheading"
              label="Subheading"
              rules={[{ required: true, message: 'Subheading is required' }]}
            >
              <TextArea placeholder="e.g., We provide professional, gentle, and modern dental care..." rows={3} />
            </Form.Item>

            <S.SectionTitle>Primary Button</S.SectionTitle>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="primary_button_text"
                  label="Button Text"
                  rules={[{ required: true, message: 'Button text is required' }]}
                >
                  <Input placeholder="e.g., Book an Appointment" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="primary_button_link"
                  label="Button Link"
                  rules={[{ required: true, message: 'Button link is required' }]}
                >
                  <Input placeholder="e.g., /book" />
                </Form.Item>
              </Col>
            </Row>

            <S.SectionTitle>Hero Image</S.SectionTitle>
            <Form.Item
              label="Hero Image"
              required
              rules={[
                {
                  validator: () => {
                    if (fileList.length === 0 && !heroData?.hero_image && !selectedFile && !isRemoved) {
                      return Promise.reject(new Error('Please upload a hero image.'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <S.ImageUploadWrapper>
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleImageChange}
                  beforeUpload={() => false}
                  accept="image/*"
                  maxCount={1}
                >
                  {fileList.length === 0 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
                {uploading && <div style={{ marginTop: 4, color: '#1890ff' }}>Uploading...</div>}
                {selectedFile && !uploading && <div style={{ marginTop: 4, color: '#888' }}>Image selected. Upload on save.</div>}
                <div style={{ marginTop: 4, fontSize: 12, color: '#888' }}>
                  Supported: PNG, JPG, JPEG, WEBP (Max 5MB)
                </div>
              </S.ImageUploadWrapper>
            </Form.Item>

            <S.SectionTitle>Floating Cards</S.SectionTitle>
            <Form.List name="cards">
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
                            <Input placeholder="e.g., Experienced Dentists" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                          <Form.Item
                            name={[field.name, 'value']}
                            fieldKey={[field.fieldKey, 'value']}
                            label="Value"
                            rules={[{ required: true, message: 'Value is required' }]}
                          >
                            <Input placeholder="e.g., 10+" />
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
                      </Row>
                    </Card>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
                    Add Card
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

export default memo(Hero);