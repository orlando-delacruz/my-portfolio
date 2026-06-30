import styled from "styled-components";
import AdminLayout from "../../components/admin/AdminLayout";

const Page = styled.div`
  color: #222222;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const PageDevelopment = () => {
  return (
    <>

      <AdminLayout>\
        <Page>
          <h1>This Page is Under Development...</h1>
        </Page>
      </AdminLayout>

    </>
  );
};

export default PageDevelopment;
