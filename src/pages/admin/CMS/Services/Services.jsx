// src/pages/admin/CMS/Services/Services.jsx
import { memo, useState, useCallback } from 'react';
import { Button, message, Spin, Empty, Modal, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AdminLayout from '../../../../components/admin/AdminLayout';
import {
  useCmsServices,
  useCreateCmsService,
  useUpdateCmsService,
  useDeleteCmsService,
} from '../../../../hooks/cms/useCmsServices';
import ServiceCard from './ServiceCard';
import ServiceModal from './ServiceModal';
import * as S from './Services.styled';

const Services = () => {
  const { data: services, isLoading, error, refetch } = useCmsServices();
  const createMutation = useCreateCmsService();
  const updateMutation = useUpdateCmsService();
  const deleteMutation = useDeleteCmsService();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const handleAdd = useCallback(() => {
    setEditingService(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((service) => {
    setEditingService(service);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback((id) => {
    Modal.confirm({
      title: 'Delete Service',
      content: 'Are you sure you want to delete this service? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteMutation.mutateAsync(id);
          message.success('Service deleted successfully');
          refetch();
        } catch (err) {
          message.error(err.message || 'Failed to delete service');
        }
      },
    });
  }, [deleteMutation, refetch]);

  const handlePreview = useCallback((service) => {
    Modal.info({
      title: service.title,
      content: (
        <div>
          <p><strong>Short Description:</strong> {service.short_description}</p>
          <p><strong>Full Description:</strong> {service.full_description || 'N/A'}</p>
          <p><strong>Slug:</strong> {service.slug}</p>
          <p><strong>Button Text:</strong> {service.button_text}</p>
          <p><strong>Button Link:</strong> {service.button_link || 'N/A'}</p>
          <p><strong>Active:</strong> {service.is_active ? 'Yes' : 'No'}</p>
          <p><strong>Show on Homepage:</strong> {service.show_on_homepage ? 'Yes' : 'No'}</p>
          <p><strong>Display Order:</strong> {service.display_order}</p>
          {service.featured_image && (
            <img src={service.featured_image} alt={service.title} style={{ maxWidth: '100%', maxHeight: 200 }} />
          )}
        </div>
      ),
      width: 600,
    });
  }, []);

  const handleDuplicate = useCallback((service) => {
    // Create a copy without id, created_at, updated_at
    const rest = { ...service };
    delete rest.id;
    delete rest.created_at;
    delete rest.updated_at;
    const duplicate = {
      ...rest,
      title: `${rest.title} (Copy)`,
      slug: `${rest.slug}-copy`,
      display_order: (rest.display_order || 0) + 1,
    };
    setEditingService({ ...duplicate, id: undefined });
    setModalOpen(true);
  }, []);

  const handleModalSave = useCallback(async (payload) => {
    setModalLoading(true);
    try {
      if (editingService?.id) {
        await updateMutation.mutateAsync({ id: editingService.id, payload });
        message.success('Service updated successfully');
      } else {
        await createMutation.mutateAsync(payload);
        message.success('Service created successfully');
      }
      setModalOpen(false);
      setEditingService(null);
      refetch();
    } catch (err) {
      message.error(err.message || 'Failed to save service');
    } finally {
      setModalLoading(false);
    }
  }, [editingService, createMutation, updateMutation, refetch]);

  const handleModalCancel = useCallback(() => {
    setModalOpen(false);
    setEditingService(null);
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div style={{ padding: '40px 24px', textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div style={{ padding: '40px 24px' }}>
          <Alert type="error" message="Failed to load services" description={error.message} showIcon />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <S.PageContainer>
        <S.Header>
          <div>
            <S.Title>Services Section</S.Title>
            <S.Subtitle>Manage the services displayed on your public website.</S.Subtitle>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Service
          </Button>
        </S.Header>

        <S.CardGrid>
          {services && services.length > 0 ? (
            services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPreview={handlePreview}
                onDuplicate={handleDuplicate}
              />
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0' }}>
              <Empty description="No services added yet. Click 'Add Service' to create one." />
            </div>
          )}
        </S.CardGrid>
      </S.PageContainer>

      <ServiceModal
        open={modalOpen}
        service={editingService}
        onSave={handleModalSave}
        onCancel={handleModalCancel}
        loading={modalLoading}
      />
    </AdminLayout>
  );
};

export default memo(Services);