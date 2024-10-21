import React  from 'react';
import { Modal } from 'antd';
import AddForm from './AddForm';
import UpdateForm from './UpdateForm';

type User = {
  id: number,
  name: string,
  email: string,
  password: string,
  key: React.Key
}
interface Props {
  open: boolean;
  setOpen: (status: boolean) => void;
  action: string,
  item: User
}

const ModalComponent= React.forwardRef(({action, open, setOpen, item}: Props) => {
  const handleDelete = () => {
    window.electron.ipcRenderer.invoke("deleteUser", item.id)
    .then((result) => {
      if (!result) console.log("error");
      setOpen(false)
    })
    .catch((error) => {
      console.log(error);
      setOpen(false)
    })
  }

    if(action === 'delete'){
      return (
        <Modal
          title="Delete account"
          centered
          open={open}
          onOk={handleDelete}
          onCancel={() => setOpen(false)}
        >
          <p>Are you sure?</p>
        </Modal>
      )
    }if(action === "update"){
      return (
        <Modal
          title="Update account"
          centered
          open={open}
          footer={null}
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        >
          <UpdateForm attr={item} setOpen={setOpen}></UpdateForm>
        </Modal>)
    }else{
      return (
      <Modal
        title="Add account"
        centered
        open={open}
        footer={null}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      >
        <AddForm setOpen={setOpen}></AddForm>
      </Modal>)
    }
  })

export default ModalComponent;