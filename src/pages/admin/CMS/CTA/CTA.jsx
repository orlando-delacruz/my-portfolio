// src/pages/admin/CMS/CTA/CTA.jsx
import { memo, useState, useEffect } from "react";
import { Form, Input, Button, message, Spin, Alert, Upload } from "antd";
import { SaveOutlined, PlusOutlined } from "@ant-design/icons";
import AdminLayout from "../../../../components/admin/AdminLayout";
import { useCta, useUpdateCta, uploadCtaImage } from "../../../../hooks/cms/useCta";
import * as S from "./CTA.styled";

const { TextArea } = Input;

// Helper: convert URL to UploadFile
const urlToUploadFile = (url) => {
  if (!url) return null;
  return {
    uid: "-1",
    name: url.split("/").pop() || "image",
    status: "done",
    url,
  };
};

const CTA = () => {
  const { data: ctaData, isLoading, error, refetch } = useCta();
  const updateMutation = useUpdateCta();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);

  // Populate form when data loads
  useEffect(() => {
    if (ctaData) {
      form.setFieldsValue({
        title: ctaData.title || "",
        description: ctaData.description || "",
      });
      // Set image file list
      if (ctaData.background_image) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFileList([urlToUploadFile(ctaData.background_image)]);
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFileList([]);
      }
    }
  }, [ctaData, form]);

  const handleImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleFinish = async (values) => {
    if (!ctaData) {
      message.error("CTA data is not loaded. Please refresh the page.");
      return;
    }

    setSaving(true);
    try {
      let background_image = ctaData.background_image || null;

      // Check if a new file was uploaded
      const newFile = fileList.find(f => f.originFileObj);
      if (newFile) {
        setUploading(true);
        try {
          background_image = await uploadCtaImage(newFile.originFileObj);
        } catch (uploadErr) {
          message.error(uploadErr.message || "Image upload failed");
          setUploading(false);
          setSaving(false);
          return;
        }
        setUploading(false);
      } else if (fileList.length === 0) {
        background_image = null;
      }

      const payload = {
        id: ctaData.id,
        title: values.title,
        description: values.description,
        background_image,
        is_active: true,
      };

      await updateMutation.mutateAsync(payload);
      message.success("CTA section updated successfully!");
      await refetch();
    } catch (err) {
      console.error("Save error:", err);
      message.error(err.message || "Failed to update CTA section.");
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
          <Alert type="error" message="Failed to load CTA data" description={error.message} showIcon />
        </S.Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <S.Container>
        <S.Header>
          <S.Title>Call-to-Action Section</S.Title>
          <S.Subtitle>Manage the call-to-action section displayed at the bottom of your public homepage.</S.Subtitle>
        </S.Header>

        <S.Card>
          <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
            <S.SectionTitle>Content</S.SectionTitle>

            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Title is required." }]}
            >
              <Input placeholder="e.g., Ready for a Healthier and Brighter Smile?" size="large" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Description is required." }]}
            >
              <TextArea placeholder="Describe the call-to-action..." rows={3} size="large" />
            </Form.Item>

            <S.SectionTitle>Background Image</S.SectionTitle>

            <Form.Item
              label="Background Image"
              rules={[
                {
                  validator: () => {
                    if (fileList.length === 0 && !ctaData?.background_image) {
                      return Promise.reject(new Error("Please upload a background image."));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
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
              {uploading && <div style={{ marginTop: 4, color: "#1890ff" }}>Uploading...</div>}
              <div style={{ marginTop: 4, fontSize: 12, color: "#888" }}>
                Supported: PNG, JPG, JPEG, WEBP (Max 5MB)
              </div>
            </Form.Item>

            <Form.Item style={{ marginTop: 24, textAlign: "right" }}>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving || uploading}>
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </S.Card>
      </S.Container>
    </AdminLayout>
  );
};

export default memo(CTA);