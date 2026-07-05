// src/components/admin/Modal/ClinicClosureModal/ClinicClosureModal.jsx
import { memo, useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, TimePicker, Switch, Row, Col, Button } from 'antd';
import dayjs from 'dayjs';
import { useBranches } from '../../../../hooks/useBranches';
import { CLOSURE_TYPES } from '../../../../data/admin/clinicClosures';
import * as S from './ClinicClosureModal.styled';

const { Option } = Select;
const { TextArea } = Input;

const ClinicClosureModal = memo(({ open, closure, onClose, onSave, loading }) => {
  const [form] = Form.useForm();
  const { branches, loading: branchesLoading } = useBranches();
  const [isAllDay, setIsAllDay] = useState(true);

  useEffect(() => {
    if (open) {
      if (closure) {
        // Edit mode
        form.setFieldsValue({
          branch_id: closure.branch_id || closure.branch?.id,
          title: closure.title,
          closure_type: closure.closure_type,
          reason: closure.reason || '',
          dateRange: [
            closure.start_date ? dayjs(closure.start_date) : dayjs(),
            closure.end_date ? dayjs(closure.end_date) : dayjs(),
          ],
          is_all_day: closure.is_all_day ?? true,
          start_time: closure.start_time ? dayjs(closure.start_time, 'HH:mm:ss') : null,
          end_time: closure.end_time ? dayjs(closure.end_time, 'HH:mm:ss') : null,
          affects_booking: closure.affects_booking ?? true,
        });
        setIsAllDay(closure.is_all_day ?? true);
      } else {
        // Add mode
        form.resetFields();
        form.setFieldsValue({
          is_all_day: true,
          affects_booking: true,
          dateRange: [dayjs(), dayjs()],
        });
        setIsAllDay(true);
      }
    }
  }, [open, closure, form]);

  const handleFinish = async (values) => {
    const { dateRange, start_time, end_time, ...rest } = values;
    const startDate = dateRange[0].format('YYYY-MM-DD');
    const endDate = dateRange[1].format('YYYY-MM-DD');
    const payload = {
      ...rest,
      start_date: startDate,
      end_date: endDate,
      start_time: isAllDay ? null : (start_time ? start_time.format('HH:mm:ss') : null),
      end_time: isAllDay ? null : (end_time ? end_time.format('HH:mm:ss') : null),
      affects_booking: rest.affects_booking ?? true,
    };
    await onSave(payload);
  };

  return (
    <Modal
      open={open}
      title={closure ? 'Edit Clinic Closure' : 'Add Clinic Closure'}
      onCancel={onClose}
      width={720}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
        {/* Branch */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="branch_id"
              label="Branch"
              rules={[{ required: true, message: 'Please select a branch.' }]}
            >
              <Select placeholder="Select branch" loading={branchesLoading}>
                {branches.map((b) => (
                  <Option key={b.id} value={b.id}>{b.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Title */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter a title.' }]}
            >
              <Input placeholder="e.g., Equipment Maintenance" />
            </Form.Item>
          </Col>
        </Row>

        {/* Closure Type */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="closure_type"
              label="Closure Type"
              rules={[{ required: true, message: 'Please select a closure type.' }]}
            >
              <Select placeholder="Select type">
                {Object.values(CLOSURE_TYPES).map((type) => (
                  <Option key={type.value} value={type.value}>{type.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Reason */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="reason" label="Reason">
              <TextArea placeholder="Optional reason" rows={3} />
            </Form.Item>
          </Col>
        </Row>

        {/* Date Range */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="dateRange"
              label="Date Range"
              rules={[{ required: true, message: 'Please select a date range.' }]}
            >
              <DatePicker.RangePicker
                style={{ width: '100%' }}
                format="MMM D, YYYY"
                placeholder={['Start date', 'End date']}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* All Day Switch */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="is_all_day" label="All Day" valuePropName="checked">
              <Switch checked={isAllDay} onChange={(checked) => setIsAllDay(checked)} />
            </Form.Item>
          </Col>
        </Row>

        {/* Times (only if not all-day) */}
        {!isAllDay && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="start_time"
                label="Start Time"
                rules={[{ required: true, message: 'Please select start time.' }]}
              >
                <TimePicker format="h:mm A" use12Hours style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="end_time"
                label="End Time"
                rules={[{ required: true, message: 'Please select end time.' }]}
              >
                <TimePicker format="h:mm A" use12Hours style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* Affects Booking */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="affects_booking" label="Affects Booking" valuePropName="checked">
              <Switch defaultChecked />
            </Form.Item>
          </Col>
        </Row>

        <S.FooterRow>
          <S.CancelBtn onClick={onClose} type="button">Cancel</S.CancelBtn>
          <Button type="primary" htmlType="submit" loading={loading} style={{ borderRadius: '8px' }}>
            {closure ? 'Update' : 'Create'}
          </Button>
        </S.FooterRow>
      </Form>
    </Modal>
  );
});

export default ClinicClosureModal;