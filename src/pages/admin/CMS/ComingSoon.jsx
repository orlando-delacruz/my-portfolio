// src/pages/admin/CMS/ComingSoon.jsx
import { memo } from 'react';
import { Result } from 'antd';
import AdminLayout from '../../../components/admin/AdminLayout';

const ComingSoon = memo(({ title = 'CMS Section' }) => {
  return (
    <AdminLayout>
      <div style={{ padding: '40px 24px' }}>
        <Result
          status="info"
          title={`${title} — Coming Soon`}
          subTitle="This CMS section will be available in a future update."
        />
      </div>
    </AdminLayout>
  );
});

ComingSoon.displayName = 'ComingSoon';
export default ComingSoon;