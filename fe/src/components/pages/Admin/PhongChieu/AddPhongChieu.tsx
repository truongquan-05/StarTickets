import {
  Card,
  Form,
  Select,
  Typography,
  InputNumber,
  Input,
  Button,
  Row,
  Col,
  message,
} from "antd";
import React from "react";
import { useCreatePhongChieu, useListCinemas } from "../../../hook/hungHook";

const { Option } = Select;
const { Title } = Typography;

const AddPhongChieu = () => {
  const [form] = Form.useForm();
  const { mutate: createMutate } = useCreatePhongChieu({
    resource: "phong_chieu",
  });
  const { data: raps = [], isLoading } = useListCinemas({ resource: "rap" });

  const onSeatsChange = () => {
    form.validateFields(["loai_so_do"]);
  };

  const onCreate = (values: Record<string, any>) => {
    const { loai_so_do, hang_thuong, hang_vip, hang_doi, trang_thai } = values;
    const [rowsStr, colsStr] = loai_so_do.split("x");
    const rows = parseInt(rowsStr, 10);
    const cols = parseInt(colsStr, 10);
    const total = hang_thuong + hang_vip + hang_doi;

    if (rows !== cols || rows !== total) {
      message.error(
        "Dữ liệu không hợp lệ: Sơ đồ phải hình vuông và tổng hàng phải khớp số hàng."
      );
      return;
    }

    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key === "trang_thai") {
        // Convert boolean or string to "1"/"0"
        const isTrue =
          value === true || value === "true" || value === 1 || value === "1";
        formData.append(key, isTrue ? "1" : "0");
      } else {
        formData.append(key, value);
      }
      console.log("Giá trị gửi đi:", values.trang_thai);
    });

    createMutate(formData, {
      onSuccess: () => {
        // message.success("Thêm phòng chiếu thành công!");
        form.resetFields();
      },
      onError: (error: any) => {
        // message.error("Thêm phòng chiếu thất bại!");
        console.error("Lỗi khi tạo phòng chiếu:", error);
      },
    });
  };

  return (
    <div>
      <Card
        style={{
          maxWidth: 1500,
          margin: "0 auto",
          padding: "10px 10%",
          height: "80vh",
          overflowY: "auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderRadius: 12,
        }}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: 32 }}>
          Thêm mới phòng chiếu
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onCreate}
          initialValues={{
            trang_thai: false,
            loai_so_do: "8x8",
            hang_thuong: 0,
            hang_vip: 0,
            hang_doi: 0,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên phòng"
                name="ten_phong"
                rules={[{ required: true, message: "Vui lòng nhập tên phòng" }]}
              >
                <Input placeholder="Nhập tên phòng" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Rạp"
                name="rap_id"
                rules={[{ required: true, message: "Vui lòng chọn rạp" }]}
              >
                <Select placeholder="Chọn rạp" loading={isLoading}>
                  {Array.isArray(raps) &&
                    raps.map((rap: any) => (
                      <Option key={rap.id} value={rap.id}>
                        {rap.ten_rap}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Loại sơ đồ (vd: 8x8)"
            name="loai_so_do"
            rules={[
              {
                validator: (_, value) => {
                  if (!/^\d+x\d+$/.test(value)) {
                    return Promise.reject(
                      "Định dạng phải là SốHàngxSốCột (vd: 8x8)"
                    );
                  }
                  const [rowsStr, colsStr] = value.split("x");
                  const rows = parseInt(rowsStr, 10);
                  const cols = parseInt(colsStr, 10);
                  if (rows !== cols) {
                    return Promise.reject(
                      "Sơ đồ phải là hình vuông (số hàng = số cột)"
                    );
                  }
                  const hangThuong = form.getFieldValue("hang_thuong") || 0;
                  const hangVip = form.getFieldValue("hang_vip") || 0;
                  const hangDoi = form.getFieldValue("hang_doi") || 0;
                  const total = hangThuong + hangVip + hangDoi;
                  if (rows !== total) {
                    return Promise.reject(
                      `Tổng hàng (${total}) phải bằng số hàng trong sơ đồ (${rows})`
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="Nhập loại sơ đồ (vd: 8x8)" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Hàng thường"
                name="hang_thuong"
                rules={[
                  { required: true, message: "Vui lòng nhập hàng thường" },
                  { type: "number", min: 0, message: "Phải là số không âm" },
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  onChange={onSeatsChange}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Hàng VIP"
                name="hang_vip"
                rules={[
                  { required: true, message: "Vui lòng nhập hàng VIP" },
                  { type: "number", min: 0, message: "Phải là số không âm" },
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  onChange={onSeatsChange}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Hàng đôi"
                name="hang_doi"
                rules={[
                  { required: true, message: "Vui lòng nhập hàng đôi" },
                  { type: "number", min: 0, message: "Phải là số không âm" },
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  onChange={onSeatsChange}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Trạng thái"
            name="trang_thai"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value={true}>Xuất bản</Option>
              <Option value={false}>Nháp</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Thêm phòng chiếu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddPhongChieu;