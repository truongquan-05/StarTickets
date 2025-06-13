import { useEffect, useState } from "react";

import {
  Button,
  // message,
  // Popconfirm,
  // Space,
  Table,
  Card,
  Form,
  Input,
  Modal,
} from "antd";
// import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ICategoryChair } from "../interface/categoryChair";
import {
  useListCategoryChair,
  // useDeleteCategoryChair,
  useCreateCategoryChairs,
  useUpdateCategoryChair,
} from "../../../hook/hungHook";

const ListCategoryChair = () => {
  const [form] = Form.useForm();
  const { data } = useListCategoryChair({ resource: "loai_ghe" });
  const dataSource = data?.data || [];
  const [isModalOpen, setModalOpen] = useState(false);
  // const [editingItem, setEditingItem] = useState<ICategoryChair | undefined>(
    
  const [editingItem] = useState<ICategoryChair | undefined>(
    undefined
  );
  const { mutate: createCategoryChair } = useCreateCategoryChairs({ resource: "loai_ghe" });
  const { mutate: updateCategoryChair } = useUpdateCategoryChair({ resource: "loai_ghe" });
  const onCreateOrUpdate = (values: ICategoryChair) => {
    if (editingItem === undefined) {
      createCategoryChair(values);
    } else {
      updateCategoryChair({ id: editingItem.id, values });
    }
    setModalOpen(false);
    form.resetFields();
  };
  useEffect(() => {
    if (isModalOpen && editingItem) {
      form.setFieldsValue({
        ...editingItem,
      });
    }
  }, [isModalOpen, editingItem]);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
      align: "center" as const,
    },
    {
      title: "Tên thể loại",
      dataIndex: "ten_loai_ghe",
      key: "name",
      align: "center" as const,
    },
    // },
  ];
  return (
    <Card title="Thêm mới phim" bordered={true} style={{ margin: 10, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <div className="btn-category-chair">
        {/* <Button
          className="add-category-chair"
          onClick={() => createOrUpdateOpenModal(undefined)}
        >
          Thêm mới
        </Button> */}
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />
      <div>
        <Modal
          title={"Category Chair Detail"}
          open={isModalOpen}
          onCancel={() => setModalOpen(false)}
          footer={null}
        >
          <Form
            form={form}
            onFinish={(values) => {
              onCreateOrUpdate(values);
            }}
            layout="vertical"
          >
            <Form.Item
              label="Name"
              name="ten_loai_ghe"
              rules={[
                { required: true, message: "Vui lòng nhập tên loại ghế!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              {editingItem == undefined ? "Thêm mới" : "Cập nhật"}
            </Button>
          </Form>
        </Modal>
      </div>
    </Card>
  );
};

export default ListCategoryChair;
