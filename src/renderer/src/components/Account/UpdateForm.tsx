import React, {useEffect} from 'react';
import { Button, Form, Input, Space, notification  } from 'antd';
import type { NotificationArgsProps } from 'antd';

type NotificationPlacement = NotificationArgsProps['placement'];

const Context = React.createContext({ name: 'Default' });

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
type User = {
     id: number,
     name: string,
     email: string,
     password: string,
     key: React.Key
}
interface AppProps {
  setOpen: (status: boolean) => void;
  attr: User
}
const App: React.FC<AppProps> = ({setOpen, attr}) => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (placement: NotificationPlacement, status, message) => {
    api.info({
      message,
      description: <Context.Consumer>{() => status}</Context.Consumer>,
      placement,
      duration: 4,
    });
  };

  useEffect(() => {
     form.setFieldsValue({
       id: attr.id,
       name: attr.name,
       email: attr.email,
       password: attr.password

     });
   });
  const onFinish = (values: any) => {
    window.electron.ipcRenderer.invoke("updateUser", values)
    .then((result) => {
          if (!result){
               openNotification('topLeft',"Something went wrong","Update failed!")

          }else{
               openNotification('topLeft',"","Update successfully!")
          }
          setOpen(false)
     })
     .catch((error) => {
          openNotification('topLeft',"Something went wrong","Update failed!")
          console.log(error);
          setOpen(false)
     })
  };

  return (
     <>
          {contextHolder}
          <Form
               {...layout}
               form={form}
               onFinish={onFinish}
               style={{ maxWidth: 600 }}
          >
               <Form.Item name="id" label="id" hidden>
                    <Input />
               </Form.Item>
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
                    Update
                    </Button>
               </Space>
               </Form.Item>
          </Form>
     </>
  );
};

export default App;