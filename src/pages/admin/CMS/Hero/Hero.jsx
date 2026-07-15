// src/pages/admin/CMS/Hero/Hero.jsx
import { memo, useState, useEffect } from 'react';
import { Form, Input, Button, message, Spin, Alert, Upload, Card, Row, Col, Space, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { useHeroAdmin, useUpdateHero, uploadHeroImage } from '../../../../hooks/cms/useHero';
import * as S from './Hero.styled';

const { TextArea } = Input;

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

// Card item component with icon and value only
const CardItem = ({ field, index, total, onDelete, onMoveUp, onMoveDown }) => {
  return (
    <Card style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item
            name={[field.name, 'icon']}
            fieldKey={[field.fieldKey, 'icon']}
            label="Icon"
            rules={[{ required: true, message: 'Icon is required' }]}
            style={{ marginBottom: 0 }}
          >
            <Input
              placeholder="Iconify icon (e.g., mdi:star, mdi:award)"
              suffix={
                <Form.Item shouldUpdate={(prev, curr) => prev?.cards?.[index]?.icon !== curr?.cards?.[index]?.icon} noStyle>
                  {({ getFieldValue }) => {
                    const icon = getFieldValue(['cards', index, 'icon']);
                    return icon ? <Icon icon={icon} style={{ fontSize: 20, color: '#886217' }} /> : null;
                  }}
                </Form.Item>
              }
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name={[field.name, 'value']}
            fieldKey={[field.fieldKey, 'value']}
            label="Value"
            rules={[{ required: true, message: 'Value is required' }]}
            style={{ marginBottom: 0 }}
          >
            <Input placeholder="e.g., 10+ Years Experience" />
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

const Hero = () => {
  const { data: heroData, isLoading, error, refetch } = useHeroAdmin();
  const updateHero = useUpdateHero();
  const [form] = Form.useForm();

  // These states are only for the image upload – they are not needed in the effect
  const [selectedFile, setSelectedFile] = useState(null);
  const [isRemoved, setIsRemoved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fileList = (() => {
    if (selectedFile) {
      return [{ uid: '-2', name: selectedFile.name, status: 'done', originFileObj: selectedFile }];
    }
    if (isRemoved) return [];
    if (heroData?.hero_image) {
      const file = urlToUploadFile(heroData.hero_image);
      return file ? [file] : [];
    }
    return [];
  })();

  const imagePreview = (() => {
    if (selectedFile) return URL.createObjectURL(selectedFile);
    if (isRemoved) return null;
    return heroData?.hero_image || null;
  })();

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Populate form with hero data – this is a one‑time sync
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
      // No need to reset selectedFile/isRemoved here – they are derived from heroData
    }
  }, [heroData, form]);

  const handleImageChange = ({ file }) => {
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
    console.log('🔍 Form values before submit:', values);
    try {
      let heroImage = null;

      if (isRemoved) {
        heroImage = null;
      } else if (selectedFile) {
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
        heroImage = heroData?.hero_image || null;
      }

      // Ensure each card has value and icon; title is set to value (fallback to empty string)
      const cards = (values.cards || []).map((card, index) => ({
        title: card.value || '',
        value: card.value || '',
        icon: card.icon || null,
        display_order: card.display_order !== undefined ? card.display_order : index,
        is_active: true,
      }));

      console.log('📦 Payload cards:', cards);

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

      console.log('📦 Full payload:', payload);

      await updateHero.mutateAsync(payload);
      message.success('Hero section updated successfully');
      setSelectedFile(null);
      setIsRemoved(false);
      refetch();
    } catch (err) {
      console.error('❌ Save error:', err);
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
              {(fields, { add, move, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <CardItem
                      key={field.key}
                      field={field}
                      index={index}
                      total={fields.length}
                      onDelete={() => remove(field.name)}
                      onMoveUp={() => move(index, index - 1)}
                      onMoveDown={() => move(index, index + 1)}
                    />
                  ))}
                  <Button type="dashed" onClick={() => add({ icon: '', value: '' })} icon={<PlusOutlined />} block>
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