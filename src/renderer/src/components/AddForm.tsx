import React from 'react';
import { Button, Form, Input, Space } from 'antd';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
interface AppProps {
  setOpen: (status: boolean) => void;
}
const App: React.FC<AppProps> = ({setOpen}) => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    window.electron.ipcRenderer.invoke("addUser", values)
    .then((result) => {
      if (!result) console.log(result);
      onReset()
      setOpen(false)
    })
    .catch((error) => {
      console.log(error);
    })
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form
      {...layout}
      form={form}
      name="123"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
    >
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="password" label="Password" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Space>
          <Button type="primary" htmlType="submit" >
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default App;