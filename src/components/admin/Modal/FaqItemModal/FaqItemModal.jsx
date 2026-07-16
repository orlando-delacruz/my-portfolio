// src/components/admin/Modal/FaqItemModal/FaqItemModal.jsx
import { memo, useEffect } from "react";
import { Modal, Form, Input, InputNumber, Switch } from "antd";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import * as S from "./FaqItemModal.styled";

const { TextArea } = Input;

const FaqItemModal = memo(({ open, item, onClose, onSave, loading }) => {
  const [form] = Form.useForm();
  const isEditing = !!item?.id;

  useEffect(() => {
    if (open) {
      if (item) {
        form.setFieldsValue({
          question: item.question || "",
          answer: item.answer || "",
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
      title={<S.ModalTitle>{isEditing ? "Edit FAQ" : "Add FAQ"}</S.ModalTitle>}
      width={640}
      centered
      destroyOnHidden
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <S.FormGrid>
          <S.FullWidth>
            <Form.Item
              name="question"
              label="Question"
              rules={[{ required: true, message: "Please enter the question." }]}
            >
              <Input placeholder="e.g., Do you accept walk-in patients?" />
            </Form.Item>
          </S.FullWidth>

          <S.FullWidth>
            <Form.Item
              name="answer"
              label="Answer"
              rules={[{ required: true, message: "Please enter the answer." }]}
            >
              <TextArea
                rows={4}
                placeholder="Write the answer to the question..."
              />
            </Form.Item>
          </S.FullWidth>

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
            <SaveOutlined /> {loading ? "Saving…" : isEditing ? "Update" : "Add"} FAQ
          </S.SubmitBtn>
        </S.FooterRow>
      </Form>
    </Modal>
  );
});

FaqItemModal.displayName = "FaqItemModal";
export default FaqItemModal;