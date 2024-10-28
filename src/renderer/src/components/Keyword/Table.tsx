import React, { useRef, useState } from 'react';
import { Button, Flex, Table, Space, Input, Modal } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';



type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface DataType {
  key: React.Key;
  url: string;
  title: string;
}

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // const [loading, setLoading] = useState(false);
  const [dataSource, setData] = useState([]);
  const inputRef = useRef(null)


  const start = () => {
    setLoading(true);
    window.electron.ipcRenderer.invoke('crawlPost', selectedRowKeys)
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

  const crawlPosts = () => {
    if(inputRef.current.input.value.trim() !== "" && inputRef.current.input.value){
      window.electron.ipcRenderer.invoke('crawlPosts', inputRef.current.input.value)
        .then((result) => {
          result.map((element: DataType) => {
            element.key = element.url
          })
          setData(result)
        })
      .catch((error) => {
          console.log(error);
        })
    }else{
      showModal()
    }
  }
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const hasSelected = selectedRowKeys.length > 0;
  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const manipulateItem = (action, record) => {
    if(action === "getPosts"){
      var urls = []
      if(record instanceof Array){
        urls = record.map((e) => {
          return e.url
        })
      }else{
        urls = [record.url]
      }
      window.electron.ipcRenderer.invoke('crawlPost', urls)
        .then((result) => {
          if(!result){
            console.log("error");
          }
        })
      .catch((error) => {
          console.log(error);
        })
    }else{
      window.electron.ipcRenderer.invoke('previewPost', record.url)
        .then((result) => {
          if(!result){
            console.log("error");
          }
        })
      .catch((error) => {
          console.log(error);
        })
    }
  }
  const columns: TableColumnsType<DataType> = [
    { title: 'Title', dataIndex: 'title', width: "40%" },
    { title: 'Url', dataIndex: 'url', width: "30%", ellipsis: true },
    {
       title: 'Action',
       key: 'action',
       render: (record) => (
         <Space size="middle">
           <Button type="primary" onClick={() => {manipulateItem('getPosts', record)}}>Get Post</Button>
           <Button type='default' style={{ backgroundColor:'green',color: "white" }} variant="outlined" onClick={() => {manipulateItem("preview", record)}}>
              Preview
            </Button>
         </Space>
       ),
       width: "30%"
     },
  ];
  return (
     <Flex gap="middle" vertical style={{ maxHeight: "100%" }}>
      <Input ref={inputRef} placeholder='type your keyword' id='keyword-crawl'></Input>
      <Flex align='center' justify='space-between' style={{ marginTop: "10px" }}>
        <Flex align="center" gap="middle">
          <Button onClick={start} type="primary" disabled={!hasSelected}>
          Get post selected
          </Button>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
        </Flex>
        <Button type="primary" onClick={() => {crawlPosts()}}>Crawl</Button>
      </Flex>
      <div style={{ maxHeight: "100%", width: "100%"}}>
        <Table<DataType> rowSelection={rowSelection} columns={columns} dataSource={dataSource} scroll={{ x: '100' }} />
      </div>
      <Modal title="Warning" open={isModalOpen} onOk={handleOk}>
        <p>You have to type keyword!</p>
      </Modal>
     </Flex>
  );
};

export default App;