// src/components/admin/Modal/BranchItemModal/BranchItemModal.jsx
import { memo, useEffect } from "react";
import { Modal, Form, Input, InputNumber, Switch } from "antd";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import * as S from "./BranchItemModal.styled";

const { TextArea } = Input;

const BranchItemModal = memo(({ open, item, onClose, onSave, loading }) => {
  const [form] = Form.useForm();
  const isEditing = !!item?.id;

  useEffect(() => {
    if (open) {
      if (item) {
        form.setFieldsValue({
          name: item.name || "",
          location: item.location || "",
          map_embed_url: item.map_embed_url || "",
          address: item.address || "",
          phone: item.phone || "",
          email: item.email || "",
          hours: item.hours || "",
          services: item.services || "",
          display_order: item.display_order || 0,
          is_active: item.is_active !== undefined ? item.is_active : true,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          display_order: 0,
          is_active: true,
        });
      }
    }
  }, [open, item, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSave(values);
    } catch {
      // Ant Design handles field-level errors
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      title={<S.ModalTitle>{isEditing ? "Edit Branch" : "Add Branch"}</S.ModalTitle>}
      width={720}
      centered
      destroyOnHidden
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <S.FormGrid>
          <Form.Item
            name="name"
            label="Branch Name"
            rules={[{ required: true, message: "Please enter branch name." }]}
          >
            <Input placeholder="e.g., Main Branch" />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please enter location." }]}
          >
            <Input placeholder="e.g., Rosario, Batangas" />
          </Form.Item>

          <S.FullWidth>
            <Form.Item
              name="map_embed_url"
              label="Google Maps Embed URL"
              rules={[{ required: true, message: "Please enter the map embed URL." }]}
              extra="Paste the iframe src from Google Maps."
            >
              <Input placeholder="https://www.google.com/maps/embed?pb=..." />
            </Form.Item>
          </S.FullWidth>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter address." }]}
          >
            <Input placeholder="Full address" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: "Please enter phone number." }]}
          >
            <Input placeholder="(+63) 9123456789" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email." },
              { type: "email", message: "Please enter a valid email." },
            ]}
          >
            <Input placeholder="clinic@example.com" />
          </Form.Item>

          <Form.Item
            name="hours"
            label="Clinic Hours"
            rules={[{ required: true, message: "Please enter clinic hours." }]}
          >
            <Input placeholder="Monday – Friday | 9:00 AM – 5:00 PM" />
          </Form.Item>

          <S.FullWidth>
            <Form.Item
              name="services"
              label="Services"
              rules={[{ required: true, message: "Please enter at least one service." }]}
              extra="Enter each service on a new line."
            >
              <TextArea
                placeholder="General Dentistry&#10;Cleaning&#10;Fillings"
                rows={4}
              />
            </Form.Item>
          </S.FullWidth>

          <Form.Item name="display_order" label="Display Order">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="is_active" label="Active" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
        </S.FormGrid>

        <S.FooterRow>
          <S.CancelBtn onClick={handleCancel} type="button" disabled={loading}>
            <CloseOutlined /> Cancel
          </S.CancelBtn>
          <S.SubmitBtn onClick={handleOk} disabled={loading} type="button">
            <SaveOutlined /> {loading ? "Saving…" : isEditing ? "Update" : "Add"} Branch
          </S.SubmitBtn>
        </S.FooterRow>
      </Form>
    </Modal>
  );
});

BranchItemModal.displayName = "BranchItemModal";
export default BranchItemModal;