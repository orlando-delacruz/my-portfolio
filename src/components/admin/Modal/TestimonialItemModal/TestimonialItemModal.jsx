// src/components/admin/Modal/TestimonialItemModal/TestimonialItemModal.jsx
import { memo, useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, Switch } from "antd";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import * as S from "./TestimonialItemModal.styled";

const { TextArea } = Input;
const { Option } = Select;

const TestimonialItemModal = memo(({ open, item, onClose, onSave, loading }) => {
  const [form] = Form.useForm();
  const isEditing = !!item?.id;

  useEffect(() => {
    if (open) {
      if (item) {
        form.setFieldsValue({
          name: item.name || "",
          quote: item.quote || "",
          service: item.service || "",
          rating: item.rating || 5,
          display_order: item.display_order || 0,
          is_active: item.is_active !== undefined ? item.is_active : true,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          rating: 5,
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
      title={<S.ModalTitle>{isEditing ? "Edit Testimonial" : "Add Testimonial"}</S.ModalTitle>}
      width={640}
      centered
      destroyOnHidden
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <S.FormGrid>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter the patient's name." }]}
          >
            <Input placeholder="e.g., Maria Santos" />
          </Form.Item>

          <Form.Item
            name="service"
            label="Service (optional)"
          >
            <Input placeholder="e.g., Dental Checkup" />
          </Form.Item>

          <S.FullWidth>
            <Form.Item
              name="quote"
              label="Testimonial"
              rules={[{ required: true, message: "Please enter the testimonial text." }]}
            >
              <TextArea rows={4} placeholder="Write the patient's testimonial..." />
            </Form.Item>
          </S.FullWidth>

          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: "Please select a rating." }]}
          >
            <Select placeholder="Select rating">
              <Option value={1}>⭐ 1 Star</Option>
              <Option value={2}>⭐⭐ 2 Stars</Option>
              <Option value={3}>⭐⭐⭐ 3 Stars</Option>
              <Option value={4}>⭐⭐⭐⭐ 4 Stars</Option>
              <Option value={5}>⭐⭐⭐⭐⭐ 5 Stars</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="display_order"
            label="Display Order"
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Active"
            valuePropName="checked"
          >
            <Switch defaultChecked />
          </Form.Item>
        </S.FormGrid>

        <S.FooterRow>
          <S.CancelBtn onClick={handleCancel} type="button" disabled={loading}>
            <CloseOutlined /> Cancel
          </S.CancelBtn>
          <S.SubmitBtn onClick={handleOk} disabled={loading} type="button">
            <SaveOutlined /> {loading ? "Saving…" : isEditing ? "Update" : "Add"} Testimonial
          </S.SubmitBtn>
        </S.FooterRow>
      </Form>
    </Modal>
  );
});

TestimonialItemModal.displayName = "TestimonialItemModal";
export default TestimonialItemModal;