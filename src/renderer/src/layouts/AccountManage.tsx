import React from 'react';
import { Breadcrumb, Layout } from 'antd';
import Table from "../components/Account/Table"

const { Content } = Layout;

const App: React.FC = () => {

  return (
     <Content style={{ margin: '0 16px' }}>
     <Breadcrumb style={{ margin: '16px 0' }}>
       <Breadcrumb.Item>User</Breadcrumb.Item>
       <Breadcrumb.Item>Account</Breadcrumb.Item>
     </Breadcrumb>
     <Table></Table>
   </Content>
  );
};

export default App;