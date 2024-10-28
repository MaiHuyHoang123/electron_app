import React, { useState } from 'react';
import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import AccountManage from "./layouts/AccountManage"
import KeywordManage from "./layouts/KeywordManage"
import PostManage from "./layouts/PostManage"

const { Header, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Manage accounts', '1', <PieChartOutlined />),
  getItem('Manage keywords', '2', <DesktopOutlined />),
  getItem('Manage posts', '3', <UserOutlined />)
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [layout, setLayout] = useState(null);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const onClick: MenuProps['onClick'] = ({ key }) => {
    setLayout(key)
  };
  const renderLayout = () => {
    switch (layout) {
      case "2":
        return <KeywordManage />;
      case "3":
        return <PostManage />
      default:
        return <AccountManage />;
    }
  };
  return (
    <Layout style={{ height: '100vh', width: '100%' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu onClick={onClick} theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout style={{ overflowY: "scroll"}}>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        { renderLayout() }
        <Footer style={{ textAlign: 'center' }}>  
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;