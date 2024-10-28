import React, { useEffect, useState } from 'react';
import { Button, Flex, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';


type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface DataType {
  key: React.Key;
  id: number
  title: string;
  comments: number;
  score: number;
}

const App: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataSource, setData] = useState([]);

  useEffect(() => {
    window.electron.ipcRenderer.invoke('getListPost', "")
      .then((result) => {
        result.map((element: DataType) => {
          element.key = element.id
        })
        setData(result)
      })
    .catch((error) => {
        console.log(error);
      })
  }, [selectedRowKeys]);

  const uploadPost = () => {
    window.electron.ipcRenderer.invoke('uploadPost', selectedRowKeys)
        .then((result) => {
          if(!result){
            console.log("error");
            setLoading(false);
          }else{
            setSelectedRowKeys([]);
            setLoading(false);
          }
        })
      .catch((error) => {
          console.log(error);
          setLoading(false);
        })
  };

  const deletePost = () => {
    window.electron.ipcRenderer.invoke('deletePost', selectedRowKeys)
        .then((result) => {
          if(!result){
            console.log("error");
            setLoading(false);
          }else{
            setSelectedRowKeys([]);
            setLoading(false);
          }
        })
      .catch((error) => {
          console.log(error);
          setLoading(false);
        })
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;
  const columns: TableColumnsType<DataType> = [
    { title: 'Title', dataIndex: 'title' },
    { title: 'Comment', dataIndex: 'comments' },
    { title: 'Score', dataIndex: 'score' }
  ];
  return (
     <>
      <Flex gap="middle" vertical style={{ maxHeight: "100%" }}>
            <Flex align='center' justify='space-between'>
                <Flex align="center" gap="middle">
                <Button type="primary" onClick={uploadPost} disabled={!hasSelected} loading={loading}>
                Upload posts
                </Button>
                <Button color="danger" variant="outlined" onClick={deletePost} disabled={!hasSelected} loading={loading}>
                Delete posts
                </Button>
                {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
                </Flex>
            </Flex>
            <div style={{ maxHeight: "100%", width: "100%"}}>
              <Table<DataType> rowSelection={rowSelection} columns={columns} dataSource={dataSource} scroll={{ x: '100%' }} />
            </div>
      </Flex>
     </>
  );
};

export default App;