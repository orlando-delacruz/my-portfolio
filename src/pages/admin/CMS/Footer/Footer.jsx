// src/pages/admin/CMS/Footer/Footer.jsx
import { memo, useState, useEffect } from "react";
import { Form, Input, Button, message, Spin, Alert, Upload, Space } from "antd";
import { SaveOutlined, PlusOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import AdminLayout from "../../../../components/admin/AdminLayout";
import { useFooter, useUpdateFooter, uploadFooterLogo } from "../../../../hooks/cms/useFooter";
import * as S from "./Footer.styled";

const { TextArea } = Input;

// Helper: convert URL to UploadFile
const urlToUploadFile = (url) => {
  if (!url) return null;
  return {
    uid: "-1",
    name: url.split("/").pop() || "logo",
    status: "done",
    url,
  };
};

// ── Repeater component for quick links, legal links ──
const Repeater = ({ label, fields, add, remove, move }) => (
  <div style={{ marginBottom: 16 }}>
    <h4>{label}</h4>
    {fields.map((field, index) => (
      <div key={field.key} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
        <Form.Item {...field} name={[field.name, "label"]} style={{ flex: 1, marginBottom: 0 }}>
          <Input placeholder="Label" />
        </Form.Item>
        <Form.Item {...field} name={[field.name, "href"]} style={{ flex: 1, marginBottom: 0 }}>
          <Input placeholder="URL" />
        </Form.Item>
        <Space>
          <Button icon={<ArrowUpOutlined />} size="small" disabled={index === 0} onClick={() => move(index, index - 1)} />
          <Button icon={<ArrowDownOutlined />} size="small" disabled={index === fields.length - 1} onClick={() => move(index, index + 1)} />
          <Button icon={<DeleteOutlined />} size="small" danger onClick={() => remove(field.name)} />
        </Space>
      </div>
    ))}
    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
      Add {label.slice(0, -1)}
    </Button>
  </div>
);

// ── Branch repeater ──
const BranchRepeater = ({ label, fields, add, remove, move }) => (
  <div style={{ marginBottom: 16 }}>
    <h4>{label}</h4>
    {fields.map((field, index) => (
      <div key={field.key} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 12 }}>
        <Form.Item {...field} name={[field.name, "name"]} label="Branch Name" style={{ marginBottom: 8 }}>
          <Input placeholder="e.g., Main Branch" />
        </Form.Item>
        <Form.Item {...field} name={[field.name, "address"]} label="Address" style={{ marginBottom: 8 }}>
          <Input placeholder="Full address" />
        </Form.Item>
        <Form.Item {...field} name={[field.name, "hours"]} label="Hours" style={{ marginBottom: 8 }}>
          <Input placeholder="e.g., Mon – Fri: 9:00 AM – 6:00 PM" />
        </Form.Item>
        <Form.Item {...field} name={[field.name, "phone"]} label="Phone" style={{ marginBottom: 8 }}>
          <Input placeholder="+63 9123456789" />
        </Form.Item>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button icon={<ArrowUpOutlined />} size="small" disabled={index === 0} onClick={() => move(index, index - 1)} />
          <Button icon={<ArrowDownOutlined />} size="small" disabled={index === fields.length - 1} onClick={() => move(index, index + 1)} />
          <Button icon={<DeleteOutlined />} size="small" danger onClick={() => remove(field.name)} />
        </div>
      </div>
    ))}
    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
      Add Branch
    </Button>
  </div>
);

const Footer = () => {
  const { data: footerData, isLoading, error, refetch } = useFooter();
  const updateMutation = useUpdateFooter();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [logoFileList, setLogoFileList] = useState([]);

  // Populate form when data loads
  useEffect(() => {
    if (footerData) {
      // Basic fields
      form.setFieldsValue({
        clinic_name: footerData.clinic_name || "",
        clinic_tagline: footerData.clinic_tagline || "",
        clinic_description: footerData.clinic_description || "",
        phone: footerData.phone || "",
        email: footerData.email || "",
        address: footerData.address || "",
        operating_hours: footerData.operating_hours || "",
        copyright_text: footerData.copyright_text || "",
        // social links – extract from array
        facebook_url: footerData.social_links?.find(l => l.id === "facebook")?.url || "",
        instagram_url: footerData.social_links?.find(l => l.id === "instagram")?.url || "",
        // quick links
        quick_links: footerData.quick_links || [],
        // legal links
        legal_links: footerData.legal_links || [],
        // branches
        branch_items: footerData.branch_items ? footerData.branch_items.map(b => ({
          name: b.name,
          address: b.details?.find(d => d.id === "address")?.value || "",
          hours: b.details?.find(d => d.id === "hours")?.value || "",
          phone: b.details?.find(d => d.id === "phone")?.value || "",
        })) : [],
      });

      // Logo file list – sync from external data
      if (footerData.logo_url) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLogoFileList([urlToUploadFile(footerData.logo_url)]);
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLogoFileList([]);
      }
    }
  }, [footerData, form]);

  const handleLogoChange = ({ fileList: newFileList }) => {
    setLogoFileList(newFileList);
  };

  const handleFinish = async (values) => {
    if (!footerData) {
      message.error("Footer data is not loaded. Please refresh the page.");
      return;
    }

    setSaving(true);
    try {
      // Upload logo if new file
      let logo_url = footerData.logo_url || null;
      const newLogoFile = logoFileList.find(f => f.originFileObj);
      if (newLogoFile) {
        setUploading(true);
        try {
          logo_url = await uploadFooterLogo(newLogoFile.originFileObj);
        } catch (uploadErr) {
          message.error(uploadErr.message || "Logo upload failed");
          setUploading(false);
          setSaving(false);
          return;
        }
        setUploading(false);
      } else if (logoFileList.length === 0) {
        logo_url = null;
      }

      // Build social_links from fields
      const social_links = [];
      if (values.facebook_url) {
        social_links.push({ id: "facebook", platform: "Facebook", url: values.facebook_url });
      }
      if (values.instagram_url) {
        social_links.push({ id: "instagram", platform: "Instagram", url: values.instagram_url });
      }

      // Build branch_items from form fields (convert to details format)
      const branch_items = (values.branch_items || []).map((b, index) => ({
        id: b.id || `branch-${index}`,
        name: b.name,
        details: [
          { id: "address", label: "Address", value: b.address },
          { id: "hours", label: "Hours", value: b.hours },
          { id: "phone", label: "Phone", value: b.phone, href: `tel:${b.phone.replace(/\s/g, "")}` },
        ],
      }));

      const payload = {
        id: footerData.id,
        clinic_name: values.clinic_name,
        clinic_tagline: values.clinic_tagline,
        clinic_description: values.clinic_description,
        logo_url,
        phone: values.phone,
        email: values.email,
        address: values.address,
        operating_hours: values.operating_hours,
        copyright_text: values.copyright_text,
        social_links,
        quick_links: values.quick_links || [],
        branch_items,
        legal_links: values.legal_links || [],
        is_active: true,
      };

      await updateMutation.mutateAsync(payload);
      message.success("Footer section updated successfully!");
      await refetch();
    } catch (err) {
      console.error("Save error:", err);
      message.error(err.message || "Failed to update Footer section.");
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
          <Alert type="error" message="Failed to load Footer data" description={error.message} showIcon />
        </S.Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <S.Container>
        <S.Header>
          <S.Title>Footer Section</S.Title>
          <S.Subtitle>Manage the footer content displayed across your public website.</S.Subtitle>
        </S.Header>

        <S.Card>
          <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
            <S.SectionTitle>Clinic Information</S.SectionTitle>

            <Form.Item
              name="clinic_name"
              label="Clinic Name"
              rules={[{ required: true, message: "Clinic name is required." }]}
            >
              <Input placeholder="e.g., Leidi Bud Dentals" size="large" />
            </Form.Item>

            <Form.Item
              name="clinic_tagline"
              label="Tagline"
            >
              <Input placeholder="e.g., Trusted Dental Clinic" size="large" />
            </Form.Item>

            <Form.Item
              name="clinic_description"
              label="Description"
            >
              <TextArea placeholder="Describe your clinic..." rows={3} size="large" />
            </Form.Item>

            <S.SectionTitle>Logo</S.SectionTitle>

            <Form.Item label="Logo Image">
              <Upload
                listType="picture-card"
                fileList={logoFileList}
                onChange={handleLogoChange}
                beforeUpload={() => false}
                accept="image/*"
                maxCount={1}
              >
                {logoFileList.length === 0 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload Logo</div>
                  </div>
                )}
              </Upload>
              {uploading && <div style={{ marginTop: 4, color: "#1890ff" }}>Uploading...</div>}
              <div style={{ marginTop: 4, fontSize: 12, color: "#888" }}>
                Supported: PNG, JPG, JPEG, WEBP (Max 5MB)
              </div>
            </Form.Item>

            <S.SectionTitle>Contact Information</S.SectionTitle>

            <Form.Item name="phone" label="Phone Number">
              <Input placeholder="+63 9123456789" size="large" />
            </Form.Item>

            <Form.Item name="email" label="Email Address">
              <Input placeholder="clinic@example.com" size="large" />
            </Form.Item>

            <Form.Item name="address" label="Physical Address">
              <Input placeholder="Rosario, Batangas, Philippines" size="large" />
            </Form.Item>

            <Form.Item name="operating_hours" label="Operating Hours">
              <Input placeholder="Mon–Fri: 9:00 AM – 5:00 PM" size="large" />
            </Form.Item>

            <S.SectionTitle>Social Media</S.SectionTitle>

            <Form.Item name="facebook_url" label="Facebook URL">
              <Input placeholder="https://www.facebook.com/..." size="large" />
            </Form.Item>

            <Form.Item name="instagram_url" label="Instagram URL">
              <Input placeholder="https://www.instagram.com/..." size="large" />
            </Form.Item>

            <S.SectionTitle>Quick Links</S.SectionTitle>

            <Form.List name="quick_links">
              {(fields, { add, remove, move }) => (
                <Repeater
                  label="Quick Links"
                  fields={fields}
                  add={add}
                  remove={remove}
                  move={move}
                />
              )}
            </Form.List>

            <S.SectionTitle>Branches</S.SectionTitle>

            <Form.List name="branch_items">
              {(fields, { add, remove, move }) => (
                <BranchRepeater
                  label="Branches"
                  fields={fields}
                  add={add}
                  remove={remove}
                  move={move}
                />
              )}
            </Form.List>

            <S.SectionTitle>Legal Links</S.SectionTitle>

            <Form.List name="legal_links">
              {(fields, { add, remove, move }) => (
                <Repeater
                  label="Legal Links"
                  fields={fields}
                  add={add}
                  remove={remove}
                  move={move}
                />
              )}
            </Form.List>

            <S.SectionTitle>Copyright</S.SectionTitle>

            <Form.Item name="copyright_text" label="Copyright Text">
              <Input placeholder="© 2026 Your Clinic. All Rights Reserved." size="large" />
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

export default memo(Footer);