import React, { useEffect, useState } from 'react';
import { Button, Flex, Table, Space } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import ModalComponent from './Modal';


type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface DataType {
  key: React.Key;
  id: number
  name: string;
  email: string;
  password: string;
}

const App: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [action, setAction] = useState('')
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataSource, setData] = useState([]);
  const [item, setitem] = useState(null)

  useEffect(() => {
    window.electron.ipcRenderer.invoke('getAllUser', "")
      .then((result) => {
        result.map((element: DataType) => {
          element.key = element.id
        })
        setData(result)
      })
    .catch((error) => {
        console.log(error);
      })
  }, [open]);

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const openModal = (action) => {
    setAction(action)
    setOpen(true)
  }
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;
  const manipulateItem = (action, record) => {
    setitem(record)
    openModal(action)
  }
  const columns: TableColumnsType<DataType> = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Password', dataIndex: 'password' },
    {
       title: 'Action',
       key: 'action',
       render: (record) => (
         <Space size="middle">
           <Button type="primary" onClick={() => {manipulateItem('update', record)}}>Update</Button>
           <Button color="danger" variant="outlined" onClick={() => {manipulateItem("delete", record)}}>
              Delete
            </Button>
         </Space>
       ),
     },
  ];
  const props = {
    action,
    open,
    setOpen,
    item
  }
  return (
     <>
          <Flex gap="middle" vertical>
               <Flex align='center' justify='space-between'>
                    <Flex align="center" gap="middle">
                    <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
                    Reload
                    </Button>
                    {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
                    </Flex>
                    <Button type="primary" onClick={() => {openModal('add')}}>Add account</Button>
               </Flex>
               <Table<DataType> rowSelection={rowSelection} columns={columns} dataSource={dataSource} />
          </Flex>
          <ModalComponent {...props}></ModalComponent>
     </>
  );
};

export default App;