// src/pages/admin/CMS/Services/ServiceCard.jsx
import { memo } from "react";
import { Card, Tag, Space, Typography, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, CopyOutlined } from "@ant-design/icons";
import * as S from "./Services.styled";

const { Text, Paragraph } = Typography;

const formatPrice = (starting, maximum) => {
  if (starting === undefined || starting === null) return "—";
  const start = Number(starting);
  const max = Number(maximum);
  if (start === max) {
    return `₱${start.toLocaleString()}`;
  }
  return `₱${start.toLocaleString()} - ₱${max.toLocaleString()}`;
};

const ServiceCard = memo(({ service, onEdit, onDelete, onPreview, onDuplicate }) => {
  const {
    title,
    title_tagalog,
    short_description,
    featured_image,
    is_active,
    show_on_homepage,
    display_order,
    slug,
    starting_price,
    maximum_price,
    branches = [],
  } = service;

  return (
    <S.CardWrapper>
      <Card
        hoverable
        cover={
          <div style={{ height: 160, overflow: "hidden", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {featured_image ? (
              <img
                src={featured_image}
                alt={title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span style={{ color: "#aaa", fontSize: 14 }}>No Image</span>
            )}
          </div>
        }
        actions={[
          <Tooltip title="Edit">
            <EditOutlined key="edit" onClick={() => onEdit(service)} />
          </Tooltip>,
          <Tooltip title="Delete">
            <DeleteOutlined key="delete" onClick={() => onDelete(service.id)} />
          </Tooltip>,
          <Tooltip title="Preview">
            <EyeOutlined key="preview" onClick={() => onPreview(service)} />
          </Tooltip>,
          <Tooltip title="Duplicate">
            <CopyOutlined key="duplicate" onClick={() => onDuplicate(service)} />
          </Tooltip>,
        ]}
      >
        <Card.Meta
          title={
            <div>
              <Text strong>{title}</Text>
              {title_tagalog && (
                <div style={{ fontSize: 13, color: "#888" }}>{title_tagalog}</div>
              )}
            </div>
          }
          description={
            <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 8 }}>
              {short_description}
            </Paragraph>
          }
        />
        <div style={{ marginTop: 8 }}>
          <Text strong style={{ fontSize: 16, color: "#886217" }}>
            {formatPrice(starting_price, maximum_price)}
          </Text>
        </div>
        <Space size={4} wrap style={{ marginTop: 8 }}>
          <Tag color={is_active ? "green" : "red"}>
            {is_active ? "Active" : "Inactive"}
          </Tag>
          {show_on_homepage && <Tag color="blue">Homepage</Tag>}
          <Tag>Order: {display_order}</Tag>
          <Tag>{slug}</Tag>
        </Space>
        {branches && branches.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>Branches:</Text>
            <Space size={4} wrap style={{ marginTop: 4 }}>
              {branches.map(b => (
                <Tag key={b.id} color="#886217">{b.name}</Tag>
              ))}
            </Space>
          </div>
        )}
      </Card>
    </S.CardWrapper>
  );
});

ServiceCard.displayName = "ServiceCard";
export default ServiceCard;