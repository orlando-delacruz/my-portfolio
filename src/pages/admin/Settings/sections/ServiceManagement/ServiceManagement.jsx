// src/pages/admin/Settings/sections/ServiceManagement/ServiceManagement.jsx
import { memo, useState, useEffect, useCallback, useMemo } from "react";
import { Button, Modal, Form, Input, InputNumber, Switch, message, Empty, Skeleton, Descriptions, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { MdMedicalServices } from "react-icons/md";
import SettingsCard from "../../../../../components/admin/Settings/SettingsCard";
import BranchTabs from "../OperatingHours/BranchTabs";
import useSettingsStore from "../../../../../store/useSettingsStore";
import * as S from "./ServiceManagement.styled";

const { confirm } = Modal;

const ServiceManagement = () => {
  const icon = MdMedicalServices;
  const [form] = Form.useForm();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const branches = useSettingsStore((state) => state.branches);
  const servicesMap = useSettingsStore((state) => state.services);
  const loadingServices = useSettingsStore((state) => state.loadingServices);
  const savingService = useSettingsStore((state) => state.savingService);
  const fetchBranchServices = useSettingsStore((state) => state.fetchBranchServices);
  const createService = useSettingsStore((state) => state.createService);
  const updateService = useSettingsStore((state) => state.updateService);
  const deleteService = useSettingsStore((state) => state.deleteService);

  const activeBranch = useMemo(() => {
    if (!branches.length) return null;
    if (selectedBranchId && branches.some((b) => b.id === selectedBranchId)) {
      return selectedBranchId;
    }
    return branches[0].id;
  }, [branches, selectedBranchId]);

  useEffect(() => {
    if (activeBranch) fetchBranchServices(activeBranch);
  }, [activeBranch, fetchBranchServices]);

  const currentServices = useMemo(() => {
    return activeBranch ? servicesMap[activeBranch] || [] : [];
  }, [activeBranch, servicesMap]);

  const selectedService = useMemo(() => {
    if (!selectedServiceId) return null;
    return currentServices.find((s) => s.id === selectedServiceId) || null;
  }, [currentServices, selectedServiceId]);

  const handleBranchChange = useCallback((branchId) => {
    setSelectedBranchId(branchId);
    setSelectedServiceId(null);
    setShowDetails(false);
  }, []);

  const handleAdd = useCallback(() => {
    setEditingService(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((service) => {
    setEditingService(service);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback((service) => {
    confirm({
      title: "Delete this service?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteService(service.id);
          message.success("Service deleted successfully.");
          if (selectedServiceId === service.id) {
            setSelectedServiceId(null);
            setShowDetails(false);
          }
        } catch (err) {
          message.error(err.message || "Failed to delete service.");
        }
      },
    });
  }, [deleteService, selectedServiceId]);

  const handleSelectService = useCallback((service) => {
    setSelectedServiceId(service.id);
    setShowDetails(true);
  }, []);

  const handleBackToList = useCallback(() => {
    setShowDetails(false);
    setSelectedServiceId(null);
  }, []);

  const handleModalCancel = useCallback(() => {
    setModalOpen(false);
    setEditingService(null);
    form.resetFields();
  }, [form]);

  const handleModalSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        branch_id: activeBranch,
        name: values.name,
        description: values.description,
        duration_minutes: values.duration_minutes,
        price: values.price,
        is_active: values.is_active,
      };

      if (editingService) {
        await updateService(editingService.id, {
          name: values.name,
          description: values.description,
          duration_minutes: values.duration_minutes,
          price: values.price,
          is_active: values.is_active,
        });
        message.success("Service updated successfully.");
      } else {
        await createService(payload);
        message.success("Service created successfully.");
      }
      setModalOpen(false);
      setEditingService(null);
      form.resetFields();
    } catch (err) {
      if (err?.errorFields) return;
      message.error(err.message || "Failed to save service.");
    }
  }, [form, activeBranch, editingService, createService, updateService]);

  useEffect(() => {
    if (modalOpen) {
      if (editingService) {
        form.setFieldsValue({
          name: editingService.name,
          description: editingService.description,
          duration_minutes: editingService.duration_minutes,
          price: editingService.price,
          is_active: editingService.is_active,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          branch_id: activeBranch,
          is_active: true,
        });
      }
    }
  }, [modalOpen, editingService, form, activeBranch]);

  const renderServiceCard = (service) => {
    const isSelected = selectedServiceId === service.id;
    return (
      <S.ServiceCard
        key={service.id}
        $selected={isSelected}
        onClick={() => handleSelectService(service)}
      >
        <S.ServiceCardHeader>
          <S.ServiceName>{service.name || "—"}</S.ServiceName>
          <Tag color={service.is_active ? "green" : "red"}>{service.is_active ? "Active" : "Inactive"}</Tag>
        </S.ServiceCardHeader>
        <S.ServiceCardMeta>
          <span>{service.duration_minutes ? `${service.duration_minutes} mins` : "—"}</span>
          <span>{service.price ? `₱${Number(service.price).toLocaleString()}` : "—"}</span>
        </S.ServiceCardMeta>
      </S.ServiceCard>
    );
  };

  const renderDetails = (service) => {
    if (!service) return <S.EmptyDetails><Empty description="Select a service to view details" /></S.EmptyDetails>;
    return (
      <S.DetailsPanel>
        <S.DetailsHeader>
          <S.DetailsTitle>{service.name || "Unnamed Service"}</S.DetailsTitle>
          <Tag color={service.is_active ? "green" : "red"}>{service.is_active ? "Active" : "Inactive"}</Tag>
        </S.DetailsHeader>
        <Descriptions bordered column={1} size="small" style={{ marginBottom: 16 }}>
          <Descriptions.Item label="Description">{service.description || "—"}</Descriptions.Item>
          <Descriptions.Item label="Duration">{service.duration_minutes ? `${service.duration_minutes} mins` : "—"}</Descriptions.Item>
          <Descriptions.Item label="Price">{service.price ? `₱${Number(service.price).toLocaleString()}` : "—"}</Descriptions.Item>
        </Descriptions>
        <S.DetailsActions>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(service)} style={{ marginRight: 8 }}>Edit</Button>
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(service)}>Delete</Button>
        </S.DetailsActions>
      </S.DetailsPanel>
    );
  };

  if (branches.length === 0) {
    return (
      <SettingsCard icon={icon} title="Service Management" subtitle="Manage services for each branch">
        <S.Container>
          <Empty description="No branches found. Please add a branch first." />
        </S.Container>
      </SettingsCard>
    );
  }

  return (
    <>
      <SettingsCard icon={icon} title="Service Management" subtitle="Manage services for each branch">
        <S.Container>
          <BranchTabs branches={branches} activeBranch={activeBranch} onBranchChange={handleBranchChange} />
          <S.Toolbar>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ background: "#886217", borderColor: "#886217" }}>
              Add Service
            </Button>
          </S.Toolbar>
          {loadingServices ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : currentServices.length === 0 ? (
            <Empty description="No services yet. Click 'Add Service' to create one." />
          ) : (
            <>
              {!showDetails ? (
                <S.ServiceListWrapper>
                  {currentServices.map(renderServiceCard)}
                </S.ServiceListWrapper>
              ) : (
                <S.DetailsWrapper>
                  <S.BackButton onClick={handleBackToList}><ArrowLeftOutlined /> Back to list</S.BackButton>
                  {renderDetails(selectedService)}
                </S.DetailsWrapper>
              )}
            </>
          )}
        </S.Container>
      </SettingsCard>

      <Modal
        open={modalOpen}
        title={editingService ? "Edit Service" : "Add Service"}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel} disabled={savingService}>Cancel</Button>,
          <Button
            key="save"
            type="primary"
            onClick={handleModalSave}
            loading={savingService}
            style={{ background: "#886217", borderColor: "#886217" }}
          >
            {editingService ? "Update Service" : "Save Service"}
          </Button>
        ]}
        width={520}
        destroyOnHidden
        forceRender
      >
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item name="name" label="Service Name" rules={[{ required: true, message: "Please enter the service name." }]}>
            <Input placeholder="e.g., Teeth Cleaning" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Optional description" rows={3} />
          </Form.Item>
          <Form.Item name="duration_minutes" label="Duration (minutes)" rules={[{ type: "number", min: 1, message: "Must be greater than 0." }]}>
            <InputNumber placeholder="e.g., 30" style={{ width: "100%" }} min={1} />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ type: "number", min: 0, message: "Cannot be negative." }]}>
            <InputNumber placeholder="e.g., 800" style={{ width: "100%" }} min={0} step={0.01} />
          </Form.Item>
          <Form.Item name="is_active" label="Active" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(ServiceManagement);