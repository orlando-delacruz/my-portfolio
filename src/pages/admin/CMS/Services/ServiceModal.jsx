// src/pages/admin/CMS/Services/ServiceModal.jsx
import { memo, useEffect, useState } from "react";
import { Modal, Form, Input, Switch, InputNumber, Upload, message, Button, Checkbox, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useUploadCmsImage } from "../../../../hooks/cms/useCmsServices";
import { useBranches } from "../../../../hooks/useBranches";

const { TextArea } = Input;

// Helper: convert a URL to an UploadFile object
const urlToUploadFile = (url) => {
  if (!url) return null;
  return {
    uid: "-1",
    name: url.split("/").pop() || "image",
    status: "done",
    url,
  };
};

// Helper: get the actual File object from an UploadFile or File
const getFileObject = (file) => {
  if (file.originFileObj && file.originFileObj instanceof File) {
    return file.originFileObj;
  }
  if (file instanceof File) {
    return file;
  }
  if (file.url) {
    return null;
  }
  return null;
};

const ServiceModal = memo(({ open, service, onSave, onCancel, loading }) => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const uploadImage = useUploadCmsImage();
  const { branches, loading: branchesLoading } = useBranches();

  const isEditing = !!service;

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Initialize form and file list when modal opens
  useEffect(() => {
    if (open && service) {
      const existingFileList = service.featured_image ? [urlToUploadFile(service.featured_image)] : [];
      form.setFieldsValue({
        title: service.title,
        title_tagalog: service.title_tagalog || "",
        slug: service.slug,
        short_description: service.short_description,
        full_description: service.full_description || "",
        starting_price: service.starting_price || 0,
        maximum_price: service.maximum_price || 0,
        display_order: service.display_order || 0,
        is_active: service.is_active !== undefined ? service.is_active : true,
        show_on_homepage: service.show_on_homepage !== undefined ? service.show_on_homepage : true,
        branch_ids: service.branch_ids || [],
      });
      setFileList(existingFileList);
      setImagePreview(service.featured_image || null);
      setImageFile(null);
    } else if (open && !service) {
      form.resetFields();
      form.setFieldsValue({
        display_order: 0,
        is_active: true,
        show_on_homepage: true,
        starting_price: 0,
        maximum_price: 0,
        branch_ids: [],
      });
      setFileList([]);
      setImagePreview(null);
      setImageFile(null);
    }
  }, [open, service, form]);

  const handleImageChange = ({ file, fileList: newFileList }) => {
    setFileList(newFileList);

    if (file.status === "removed") {
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    const fileObj = getFileObject(file);
    if (fileObj) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!allowedTypes.includes(fileObj.type)) {
        message.error("Unsupported file format. Please upload a JPG, PNG, or WEBP image.");
        setFileList(newFileList.filter(f => f.uid !== file.uid));
        return;
      }

      if (fileObj.size > 5 * 1024 * 1024) {
        message.error("File size exceeds 5MB limit. Please choose a smaller image.");
        setFileList(newFileList.filter(f => f.uid !== file.uid));
        return;
      }

      setImageFile(fileObj);
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(fileObj));
    } else if (file.url) {
      setImagePreview(file.url);
    } else {
      console.warn("Unable to extract File object from upload:", file);
    }
    return false;
  };

  const handleFinish = async (values) => {
    try {
      if (!values.branch_ids || values.branch_ids.length === 0) {
        message.error("Please select at least one branch.");
        return;
      }

      let featuredImage = null;

      const newFileEntry = fileList.find(f => f.originFileObj || f instanceof File);
      if (newFileEntry) {
        const fileObj = getFileObject(newFileEntry);
        if (fileObj) {
          setUploading(true);
          try {
            const result = await uploadImage.mutateAsync(fileObj);
            featuredImage = result;
          } catch (uploadErr) {
            console.error("Upload error:", uploadErr);
            message.error(uploadErr.message || "Image upload failed. Please try again.");
            setUploading(false);
            return;
          }
          setUploading(false);
        } else {
          if (newFileEntry.url) {
            featuredImage = newFileEntry.url;
          }
        }
      } else if (fileList.length > 0 && fileList[0].url) {
        featuredImage = fileList[0].url;
      } else if (!isEditing) {
        message.error("Please upload a featured image.");
        return;
      }

      if (values.starting_price > values.maximum_price) {
        message.error("Starting price cannot be greater than maximum price.");
        return;
      }

      const payload = {
        ...values,
        featured_image: featuredImage,
      };

      await onSave(payload);
      form.resetFields();
      setFileList([]);
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Save error:", error);
      message.error(error.message || "Failed to save service");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setImageFile(null);
    setImagePreview(null);
    onCancel();
  };

  return (
    <Modal
      open={open}
      title={isEditing ? "Edit Service" : "Add New Service"}
      onCancel={handleCancel}
      footer={null}
      width={720}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
        {/* Basic Information */}
        <h3 style={{ marginBottom: 16 }}>Basic Information</h3>
        <Form.Item
          name="title"
          label="Service Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input placeholder="e.g., General Dentistry" />
        </Form.Item>

        <Form.Item
          name="title_tagalog"
          label="Tagalog Translation"
          rules={[{ required: true, message: "Please enter Tagalog translation" }]}
        >
          <Input placeholder="e.g., Pangkalahatang Pangangalaga sa Ngipin" />
        </Form.Item>

        <Form.Item
          name="slug"
          label="Slug"
          rules={[{ required: true, message: "Slug is required" }]}
        >
          <Input placeholder="e.g., general-dentistry" />
        </Form.Item>

        {/* Descriptions */}
        <h3 style={{ marginTop: 24, marginBottom: 16 }}>Descriptions</h3>
        <Form.Item
          name="short_description"
          label="Short Description"
          rules={[
            { required: true, message: "Short description is required" },
            { max: 150, message: "Maximum 150 characters" },
          ]}
        >
          <TextArea
            placeholder="Brief description (max 150 chars)"
            rows={3}
            showCount
            maxLength={150}
          />
        </Form.Item>

        <Form.Item
          name="full_description"
          label="Full Description"
        >
          <TextArea placeholder="Detailed description" rows={5} />
        </Form.Item>

        {/* Pricing */}
        <h3 style={{ marginTop: 24, marginBottom: 16 }}>Pricing (₱)</h3>
        <Form.Item
          name="starting_price"
          label="Starting Price"
          rules={[{ required: true, message: "Starting price is required" }]}
        >
          <InputNumber
            min={0}
            step={0.01}
            style={{ width: "100%" }}
            placeholder="0.00"
            formatter={value => `₱ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={value => value.replace(/[₱,\s]/g, "")}
          />
        </Form.Item>

        <Form.Item
          name="maximum_price"
          label="Maximum Price"
          rules={[
            { required: true, message: "Maximum price is required" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value < getFieldValue("starting_price")) {
                  return Promise.reject(new Error("Maximum price must be greater than or equal to starting price"));
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <InputNumber
            min={0}
            step={0.01}
            style={{ width: "100%" }}
            placeholder="0.00"
            formatter={value => `₱ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={value => value.replace(/[₱,\s]/g, "")}
          />
        </Form.Item>

        {/* Media Section – Upload Thumbnail */}
        <h3 style={{ marginTop: 24, marginBottom: 16 }}>Media</h3>
        <Form.Item
          label="Featured Image"
          required={!isEditing}
          rules={[
            {
              validator: () => {
                if (!isEditing && (!fileList || fileList.length === 0)) {
                  return Promise.reject(new Error("Please upload a featured image."));
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
          {imageFile && !uploading && <div style={{ marginTop: 4, color: "#888" }}>Image selected. Upload on save.</div>}
          <div style={{ marginTop: 4, fontSize: 12, color: "#888" }}>
            Supported: PNG, JPG, JPEG, WEBP (Max 5MB)
          </div>
        </Form.Item>

        {/* Visibility */}
        <h3 style={{ marginTop: 24, marginBottom: 16 }}>Visibility</h3>
        <Form.Item
          name="display_order"
          label="Display Order"
        >
          <InputNumber min={0} step={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="is_active"
          label="Active"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="show_on_homepage"
          label="Show on Homepage"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        {/* Branch Assignment */}
        <h3 style={{ marginTop: 24, marginBottom: 16 }}>Clinic Branches</h3>
        <Form.Item
          name="branch_ids"
          label="Select Branches"
          rules={[{ required: true, message: "Please select at least one branch" }]}
        >
          <Checkbox.Group>
            {branchesLoading ? (
              <Spin size="small" />
            ) : (
              branches.map((branch) => (
                <Checkbox key={branch.id} value={branch.id} style={{ display: "block", marginBottom: 8 }}>
                  {branch.name}
                </Checkbox>
              ))
            )}
          </Checkbox.Group>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading || uploading}>
            {isEditing ? "Update" : "Create"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
});

ServiceModal.displayName = "ServiceModal";
export default ServiceModal;