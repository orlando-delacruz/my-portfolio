// src/pages/admin/CMS/WhyChooseUs/WhyChooseUs.jsx
import { memo, useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  message,
  Spin,
  Alert,
  Space,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { Icon } from '@iconify/react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { useWhyChooseUsAdmin, useUpdateWhyChooseUs } from '../../../../hooks/cms/useWhyChooseUs';
import * as S from './WhyChooseUs.styled';

// Card item component with icon input, preview, title, description, and move/delete buttons
const CardItem = ({ item, index, total, onDelete, onMoveUp, onMoveDown, onChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 8, border: '1px solid #f0f0f0', borderRadius: 8, marginBottom: 8 }}>
      <div style={{ flex: 1, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 200 }}>
          <Input
            placeholder="Iconify icon (e.g., mdi:calendar)"
            value={item.icon || ''}
            onChange={(e) => onChange(index, 'icon', e.target.value)}
            style={{ flex: 1 }}
          />
          {item.icon && (
            <Icon icon={item.icon} style={{ fontSize: 24, color: '#886217', flexShrink: 0 }} />
          )}
        </div>
        <Input
          placeholder="Title"
          value={item.title || ''}
          onChange={(e) => onChange(index, 'title', e.target.value)}
          style={{ flex: 1, minWidth: 120 }}
        />
        <Input
          placeholder="Description"
          value={item.description || ''}
          onChange={(e) => onChange(index, 'description', e.target.value)}
          style={{ flex: 2, minWidth: 180 }}
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

const WhyChooseUs = () => {
  const { data: sectionData, isLoading, error, refetch } = useWhyChooseUsAdmin();
  const updateSection = useUpdateWhyChooseUs();
  const [form] = Form.useForm();

  const [cards, setCards] = useState([]);
  const [saving, setSaving] = useState(false);

  // Sync form and cards when data loads
  useEffect(() => {
    if (sectionData) {
      form.setFieldsValue({
        pre_title: sectionData.pre_title || '',
        title: sectionData.title || '',
        highlight_text: sectionData.highlight_text || '',
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCards(sectionData.cards || []);
    }
  }, [sectionData, form]);

  const handleAddCard = () => {
    setCards(prev => [...prev, { icon: '', title: '', description: '', isNew: true, id: `temp-${Date.now()}` }]);
  };

  const handleDeleteCard = (index) => {
    setCards(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveCard = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === cards.length - 1) return;
    setCards(prev => {
      const newList = [...prev];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [newList[index], newList[swapIndex]] = [newList[swapIndex], newList[index]];
      return newList;
    });
  };

  const handleCardChange = (index, field, value) => {
    setCards(prev => {
      const newList = [...prev];
      newList[index] = { ...newList[index], [field]: value };
      return newList;
    });
  };

  const handleFinish = async (values) => {
    setSaving(true);
    try {
      // Validate cards: each must have icon, title, description
      const invalid = cards.some(c => !c.icon || !c.title || !c.description);
      if (invalid) {
        message.error('Please fill in all fields for each card.');
        setSaving(false);
        return;
      }

      const payload = {
        id: sectionData.id,
        pre_title: values.pre_title,
        title: values.title,
        highlight_text: values.highlight_text,
        is_active: true,
        cards: cards.map((c, index) => ({
          icon: c.icon,
          title: c.title,
          description: c.description,
          is_active: true,
          display_order: index,
        })),
      };

      await updateSection.mutateAsync(payload);
      message.success('Why Choose Us section updated successfully');
      refetch();
    } catch (err) {
      console.error(err);
      message.error(err.message || 'Failed to update section');
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
          <Alert type="error" message="Failed to load data" description={error.message} showIcon />
        </S.Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <S.Container>
        <S.Header>
          <S.Title>Why Choose Us Section</S.Title>
          <S.Subtitle>Manage the Why Choose Us content displayed on your public homepage.</S.Subtitle>
        </S.Header>

        <S.Card>
          <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
            <S.SectionTitle>Section Content</S.SectionTitle>
            <Form.Item
              name="pre_title"
              label="Pre-title"
              rules={[{ required: true, message: 'Pre-title is required' }]}
            >
              <Input placeholder="e.g., Why Us?" />
            </Form.Item>

            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Title is required' }]}
            >
              <Input placeholder="e.g., Why Patients Choose " />
            </Form.Item>

            <Form.Item
              name="highlight_text"
              label="Highlight Text"
              rules={[{ required: true, message: 'Highlight text is required' }]}
            >
              <Input placeholder="e.g., Leidi Bud" />
            </Form.Item>

            <S.SectionTitle>Cards</S.SectionTitle>
            <div style={{ marginBottom: 16 }}>
              {cards.map((card, index) => (
                <CardItem
                  key={card.id || index}
                  item={card}
                  index={index}
                  total={cards.length}
                  onDelete={() => handleDeleteCard(index)}
                  onMoveUp={() => handleMoveCard(index, 'up')}
                  onMoveDown={() => handleMoveCard(index, 'down')}
                  onChange={handleCardChange}
                />
              ))}
              <Button type="dashed" onClick={handleAddCard} icon={<PlusOutlined />} block>
                Add Card
              </Button>
            </div>

            <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" loading={saving}>
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </S.Card>
      </S.Container>
    </AdminLayout>
  );
};

export default memo(WhyChooseUs);