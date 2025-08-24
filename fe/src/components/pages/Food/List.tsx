import {
  Table,
  Button,
  Popconfirm,
  Space,
  message,
  Card,
  Typography,
  Form,
  Input,
  InputNumber,
  Modal,
  Upload,
  Select,
  Col,
  Row,
  InputRef,
} from "antd";
import {
  DeleteOutlined,
  EyeFilled,
  PlusOutlined,
  UploadOutlined,
  ClearOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { Food } from "../../types/Uses";
import {
  useListFoods,
  useCreateFood,
  useUpdateFood,
  useDeleteFood,
} from "../../hook/duHook";
import { useListCinemas } from "../../hook/hungHook";

const { Title } = Typography;

const FoodList = () => {
  const BASE_URL = "http://127.0.0.1:8000";

  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return "https://via.placeholder.com/100";
    return `${BASE_URL}/storage/${path}`;
  };

  const { data, isLoading } = useListFoods();
  const foods = data?.data ?? [];

  const { mutate: deleteFood } = useDeleteFood();
  const { mutate: createFood } = useCreateFood();
  const { mutate: updateFood } = useUpdateFood();

  const [form] = Form.useForm();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Food | undefined>(undefined);
  const [fileList, setFileList] = useState<any[]>([]);

  // State cho việc lọc
  const [selectedCinemaFilter, setSelectedCinemaFilter] = useState<
    number | undefined
  >(undefined);
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);

  const { data: cinemas } = useListCinemas({ resource: "rap" });

  // Effect để lọc dữ liệu khi foods hoặc selectedCinemaFilter thay đổi
  useEffect(() => {
    if (selectedCinemaFilter) {
      const filtered = foods.filter(
        (food: any) => food.rap?.id === selectedCinemaFilter
      );
      setFilteredFoods(filtered);
    } else {
      setFilteredFoods(foods);
    }
  }, [foods, selectedCinemaFilter]);

  // Hàm xử lý thay đổi bộ lọc rạp
  const handleCinemaFilterChange = (value: number | undefined) => {
    setSelectedCinemaFilter(value);
  };

  // Hàm xóa bộ lọc
  const clearFilter = () => {
    setSelectedCinemaFilter(undefined);
  };

  const openModal = (record?: Food) => {
    setModalOpen(true);
    setEditingItem(record);
    if (record) {
      form.setFieldsValue(record);
      setFileList(
        record.image
          ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: getImageUrl(record.image),
              },
            ]
          : []
      );
    } else {
      form.resetFields();
      setFileList([]);
    }
  };

  const handleDelete = (id: number) => {
    deleteFood(id, {
      onError: () => {
        message.error("Xoá thất bại");
      },
    });
  };

  const onFinish = async (values: Food) => {
    const formData = new FormData();
    formData.append("ten_do_an", values.ten_do_an);
    formData.append("mo_ta", values.mo_ta || "");
    formData.append("gia_nhap", values.gia_nhap.toString());
    formData.append("gia_ban", values.gia_ban.toString());
    formData.append("so_luong_ton", values.so_luong_ton.toString());
    if (Array.isArray(values.rap_id)) {
      // Tạo mới - nhiều rạp
      values.rap_id.forEach((id: number) => {
        formData.append("rap_id[]", id.toString());
      });
    } else {
      // Cập nhật - một rạp
      formData.append("rap_id", (values.rap_id as number).toString());
    }

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("image", fileList[0].originFileObj);
    }

    const mutationFn = editingItem ? updateFood : createFood;
    const payload = editingItem
      ? { id: editingItem.id, values: formData }
      : formData;

    mutationFn(payload, {
      onSuccess: () => {
        setModalOpen(false);
        form.resetFields();
        setFileList([]);
      },
      onError: () => {
        message.error(editingItem ? "Cập nhật thất bại" : "Thêm thất bại");
      },
    });
  };
  const searchInput = useRef<InputRef>(null);
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (url: string) => (
        <img src={getImageUrl(url)} alt="Ảnh món ăn" width={60} />
      ),
    },
    {
      title: "Tên món",
      dataIndex: "ten_do_an",
      key: "ten_do_an",
      align: "center",
      width: 150,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: {
        setSelectedKeys: (selectedKeys: React.Key[]) => void;
        selectedKeys: React.Key[];
        confirm: () => void;
        clearFilters?: () => void;
      }) => (
        <div
          style={{
            padding: 8,
            background: "#fff",
            borderRadius: 6,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <Input
            ref={searchInput}
            placeholder="Nhập tên món"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm?.()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              type="primary"
              onClick={() => confirm?.()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Tìm
            </Button>
            <Button
              onClick={() => clearFilters?.()}
              size="small"
              style={{ width: 90 }}
            >
              Xóa
            </Button>
          </div>
        </div>
      ),
      onFilter: (value: any, record: any) =>
        record.ten_do_an
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      filterIcon: (filtered: any) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
    },
    {
      title: "Mô tả",
      width: 250,
      align: "center",
      dataIndex: "mo_ta",
      key: "mo_ta",
    },
    {
      title: "Rạp",
      key: "rap",
      render: (_: any, record: any) => record.rap?.ten_rap || "—",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys = [],
        confirm,
        clearFilters,
      }: {
        setSelectedKeys: (selectedKeys: React.Key[]) => void;
        selectedKeys?: React.Key[];
        confirm: () => void;
        clearFilters?: () => void;
      }) => {
        // state tạm giữ lựa chọn
        const [tempKeys, setTempKeys] =
          useState<(number | string)[]>(selectedKeys as (string | number)[]);

        return (
          <div
            style={{
              padding: 10,
              background: "#fff",
              borderRadius: 6,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            {Array.isArray(cinemas) &&
              cinemas.map((rap) => (
                <div key={rap.id} style={{ marginBottom: 6 }}>
                  <label style={{ cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={tempKeys.includes(rap.id)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setTempKeys(
                          checked
                            ? [...tempKeys, rap.id]
                            : tempKeys.filter((k) => k !== rap.id)
                        );
                      }}
                      style={{ marginRight: 6 }}
                    />
                    {rap.ten_rap}
                  </label>
                </div>
              ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 6,
              }}
            >
              <button
                onClick={() => clearFilters?.()}
                style={{
                  border: "none",
                  background: "#f0f0f0",
                  padding: "4px 8px",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Xóa
              </button>
              <button
                onClick={() => {
                  setSelectedKeys?.(tempKeys);
                  confirm?.();
                }}
                style={{
                  border: "none",
                  background: "#1890ff",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Lọc
              </button>
            </div>
          </div>
        );
      },
      onFilter: (value:any, record:any) => record.rap?.id === value,
    },

    {
      title: "Giá nhập",
      dataIndex: "gia_nhap",
      key: "gia_nhap",
      render: (gia: number) => Number(gia).toLocaleString("vi-VN") + " đ",
    },
    {
      title: "Giá bán",
      dataIndex: "gia_ban",
      key: "gia_ban",
      render: (gia: number) => Number(gia).toLocaleString("vi-VN") + " đ",
    },

    {
      title: "Giá nhập",
      dataIndex: "gia_nhap",
      key: "gia_nhap",
      render: (gia: number) => Number(gia).toLocaleString("vi-VN") + " đ",
    },
    {
      title: "Giá bán",
      dataIndex: "gia_ban",
      key: "gia_ban",
      render: (gia: number) => Number(gia).toLocaleString("vi-VN") + " đ",
    },
    {
      title: "Số lượng tồn",
      dataIndex: "so_luong_ton",
      key: "so_luong_ton",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Food) => (
        <Space>
          <Button
            icon={<EyeFilled />}
            onClick={() => openModal(record)}
            type="primary"
          />
          <Popconfirm
            title="Bạn có chắc muốn xoá món này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xác nhận"
            cancelText="Huỷ"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const datauser = localStorage.getItem("user");
  const user = JSON.parse(datauser || "{}");
  const menu = user.vaitro.menu;

  return (
    <Card style={{ margin: "15px", background: "#fff", height: "95%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Danh sách món ăn
        </Title>
        {menu != 3 && (
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => openModal()}
          >
            Thêm món ăn
          </Button>
        )}
      </div>

      {/* Bộ lọc theo rạp */}
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: 500 }}>Lọc theo rạp:</span>
        <Select
          placeholder="Chọn rạp để lọc"
          style={{ width: 250 }}
          allowClear
          showSearch
          optionFilterProp="label"
          value={selectedCinemaFilter}
          onChange={handleCinemaFilterChange}
          options={[
            { label: "Tất cả rạp", value: null }, // dùng null thay vì undefined
            ...(Array.isArray(cinemas)
              ? cinemas.map((rap: any) => ({
                  label: rap.ten_rap,
                  value: rap.id,
                }))
              : []),
          ]}
          filterOption={(input, option) =>
            String(option?.label ?? "")
              .toLowerCase()
              .includes(input.toLowerCase())
          }
        />
        {selectedCinemaFilter && (
          <Button
            icon={<ClearOutlined />}
            onClick={clearFilter}
            type="link"
            size="small"
          >
            Xóa bộ lọc
          </Button>
        )}
        <span style={{ color: "#666", fontSize: "14px" }}>
          {selectedCinemaFilter
            ? `Hiển thị ${filteredFoods.length} món ăn của rạp đã chọn`
            : `Hiển thị tất cả ${filteredFoods.length} món ăn`}
        </span>
      </div>

      <Table
        rowKey="id"
        dataSource={filteredFoods}
        columns={columns}
        bordered
        pagination={{ pageSize: 5 }}
        loading={isLoading}
        locale={{ emptyText: "Không có món ăn nào." }}
      />

      <Modal
        title={editingItem ? "Cập nhật món ăn" : "Thêm món ăn"}
        open={isModalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
        width={900}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Tên món"
                name="ten_do_an"
                rules={[{ required: true, message: "Vui lòng nhập tên món!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="rap_id"
                label="Rạp"
                rules={[{ required: true, message: "Vui lòng chọn rạp" }]}
              >
                <Select
                  mode={!editingItem ? "multiple" : undefined}
                  placeholder="Chọn Rạp"
                  showSearch
                  optionFilterProp="label"
                  options={
                    cinemas?.map((rap: any) => ({
                      label: rap.ten_rap,
                      value: rap.id,
                    })) || []
                  }
                  filterOption={(input, option) =>
                    String(option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  loading={isLoading}
                />
              </Form.Item>

              <Form.Item label="Mô tả" name="mo_ta">
                <Input.TextArea />
              </Form.Item>

              <Form.Item label="Hình ảnh">
                <Upload
                  listType="picture"
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                  onRemove={() => setFileList([])}
                  beforeUpload={() => false}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Giá nhập (VND)"
                name="gia_nhap"
                rules={[{ required: true, message: "Vui lòng nhập giá nhập!" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Giá bán (VND)"
                name="gia_ban"
                rules={[{ required: true, message: "Vui lòng nhập giá bán!" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Số lượng tồn"
                name="so_luong_ton"
                rules={[
                  { required: true, message: "Vui lòng nhập số lượng tồn!" },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Button htmlType="submit" type="primary" block>
            {editingItem ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Form>
      </Modal>
    </Card>
  );
};

export default FoodList;
