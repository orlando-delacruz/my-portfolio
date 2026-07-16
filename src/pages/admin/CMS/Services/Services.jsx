// src/pages/admin/CMS/Services/Services.jsx
import { memo, useState, useCallback, useEffect, useRef } from "react";
import { Form, Input, Button, message, Spin, Alert, Modal } from "antd";
import { SaveOutlined, PlusOutlined } from "@ant-design/icons";
import AdminLayout from "../../../../components/admin/AdminLayout";
import {
  useCmsServices,
  useCreateCmsService,
  useUpdateCmsService,
  useDeleteCmsService,
  useServicesSection,
  useUpdateServicesSection,
} from "../../../../hooks/cms/useCmsServices";
import ServiceCard from "./ServiceCard";
import ServiceModal from "./ServiceModal";
import * as S from "./Services.styled";

const Services = () => {
  // ── Services section metadata ──
  const { data: sectionData, isLoading: sectionLoading, error: sectionError, refetch: refetchSection } = useServicesSection();
  const updateSectionMutation = useUpdateServicesSection();
  const [sectionForm] = Form.useForm();
  const [savingSection, setSavingSection] = useState(false);
  const formReady = useRef(false);

  // ── Service items ──
  const { data: services, isLoading, error, refetch } = useCmsServices();
  const createMutation = useCreateCmsService();
  const updateMutation = useUpdateCmsService();
  const deleteMutation = useDeleteCmsService();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Mark form as ready after mount
  useEffect(() => {
    formReady.current = true;
  }, []);

  // Populate form when data loads – only after form is ready
  useEffect(() => {
    if (sectionData && formReady.current) {
      sectionForm.setFieldsValue({
        pre_title: sectionData.pre_title || "",
        title: sectionData.title || "",
        highlight_text: sectionData.highlight_text || "",
      });
    }
  }, [sectionData, sectionForm]);

  // ── Section save ──
  const handleSectionFinish = async (values) => {
    if (!sectionData) {
      message.error("Section data is not loaded. Please refresh.");
      return;
    }
    setSavingSection(true);
    try {
      const payload = {
        id: sectionData.id,
        pre_title: values.pre_title,
        title: values.title,
        highlight_text: values.highlight_text,
        is_active: true,
      };
      await updateSectionMutation.mutateAsync(payload);
      message.success("Services section updated successfully!");
      await refetchSection();
    } catch (err) {
      console.error(err);
      message.error(err.message || "Failed to update section.");
    } finally {
      setSavingSection(false);
    }
  };

  // ── Service item actions ──
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
      title: "Delete Service",
      content: "Are you sure you want to delete this service? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteMutation.mutateAsync(id);
          message.success("Service deleted successfully");
          refetch();
        } catch (err) {
          message.error(err.message || "Failed to delete service");
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
          <p><strong>Full Description:</strong> {service.full_description || "N/A"}</p>
          <p><strong>Slug:</strong> {service.slug}</p>
          <p><strong>Active:</strong> {service.is_active ? "Yes" : "No"}</p>
          <p><strong>Show on Homepage:</strong> {service.show_on_homepage ? "Yes" : "No"}</p>
          <p><strong>Display Order:</strong> {service.display_order}</p>
          {service.featured_image && (
            <img src={service.featured_image} alt={service.title} style={{ maxWidth: "100%", maxHeight: 200 }} />
          )}
        </div>
      ),
      width: 600,
    });
  }, []);

  const handleDuplicate = useCallback((service) => {
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
        message.success("Service updated successfully");
      } else {
        await createMutation.mutateAsync(payload);
        message.success("Service created successfully");
      }
      setModalOpen(false);
      setEditingService(null);
      refetch();
    } catch (err) {
      message.error(err.message || "Failed to save service");
    } finally {
      setModalLoading(false);
    }
  }, [editingService, createMutation, updateMutation, refetch]);

  const handleModalCancel = useCallback(() => {
    setModalOpen(false);
    setEditingService(null);
  }, []);

  // ── Loading states ──
  if (sectionLoading || isLoading) {
    return (
      <AdminLayout>
        <S.LoadingContainer>
          <Spin size="large" />
        </S.LoadingContainer>
      </AdminLayout>
    );
  }

  if (sectionError || error) {
    return (
      <AdminLayout>
        <S.Container>
          <Alert type="error" message="Failed to load data" description={sectionError?.message || error?.message} showIcon />
        </S.Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <S.Container>
        <S.Header>
          <div>
            <S.Title>Services Section</S.Title>
            <S.Subtitle>Manage the services section content and individual service cards.</S.Subtitle>
          </div>
        </S.Header>

        {/* ── Section Metadata Form ── */}
        <S.Card>
          <S.SectionTitle>Section Content</S.SectionTitle>
          <Form form={sectionForm} layout="vertical" onFinish={handleSectionFinish} requiredMark={false}>
            <Form.Item
              name="pre_title"
              label="Pre-title"
              rules={[{ required: true, message: "Pre-title is required." }]}
            >
              <Input placeholder="e.g., Services" size="large" />
            </Form.Item>

            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Title is required." }]}
            >
              <Input placeholder="e.g., Dental Services " size="large" />
            </Form.Item>

            <Form.Item
              name="highlight_text"
              label="Highlight Text"
              rules={[{ required: true, message: "Highlight text is required." }]}
            >
              <Input placeholder="e.g., We Offer" size="large" />
            </Form.Item>

            <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={savingSection}>
                Save Section
              </Button>
            </Form.Item>
          </Form>
        </S.Card>

        {/* ── Service Cards ── */}
        <S.Card>
          <S.ServiceHeader>
            <S.ServiceTitle>Service Cards</S.ServiceTitle>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Add Service
            </Button>
          </S.ServiceHeader>

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
              <S.EmptyState>No services added yet. Click "Add Service" to create one.</S.EmptyState>
            )}
          </S.CardGrid>
        </S.Card>
      </S.Container>

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