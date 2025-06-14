import {
  Card,
  Form,
  Select,
  Typography,
  InputNumber,
  Input,
  Button,
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

  // Validator cho loại sơ đồ (phải là dạng "8x8" và tổng hàng đúng)
  const validateTotalSeats = (_: any, value: string) => {
    if (!value || typeof value !== "string" || !/^\d+x\d+$/.test(value)) {
      return Promise.reject(
        new Error("Loại sơ đồ phải theo định dạng SốHàngxSốCột (vd: 8x8)")
      );
    }

    const [rowsStr] = value.split("x");
    const rows = parseInt(rowsStr, 10);
    const hangThuong = form.getFieldValue("hang_thuong") || 0;
    const hangVip = form.getFieldValue("hang_vip") || 0;
    const hangDoi = form.getFieldValue("hang_doi") || 0;
    const total = hangThuong + hangVip + hangDoi;

    if (rows !== total) {
      return Promise.reject(
        new Error(
          `Tổng hàng thường + VIP + đôi (${total}) phải bằng số hàng trong sơ đồ (${rows})`
        )
      );
    }

    return Promise.resolve();
  };

  const onSeatsChange = () => {
    form.validateFields(["loai_so_do"]);
  };

  const onCreate = (values: Record<string, any>) => {
  const { loai_so_do, hang_thuong, hang_vip, hang_doi } = values;
  const [rowsStr] = loai_so_do.split("x");
  const rows = parseInt(rowsStr, 10);
  const total = hang_thuong + hang_vip + hang_doi;

  if (rows !== total) {
    message.error("Tổng hàng không khớp với số hàng trong sơ đồ.");
    return;
  }

  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (key === "trang_thai") {
      // ✅ Chuyển boolean true/false thành chuỗi "1"/"0"
      formData.append(key, value ? "1" : "0");
    } else {
      formData.append(key, value);
    }
  });

  createMutate(formData, {
    onSuccess: () => {
      message.success("Thêm phòng chiếu thành công!");
      form.resetFields();
    },
    onError: (error: any) => {
      message.error("Thêm phòng chiếu thất bại!");
      console.error("Lỗi khi tạo phòng chiếu:", error);
    },
  });
};


  return (
    <div>
      <Card>
        <Title level={3}>Thêm mới phòng chiếu</Title>
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
          <Form.Item
            label="Tên phòng"
            name="ten_phong"
            rules={[{ required: true, message: "Vui lòng nhập tên phòng" }]}
          >
            <Input placeholder="Nhập tên phòng" />
          </Form.Item>

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

          <Form.Item
            label="Loại sơ đồ (vd: 8x8)"
            name="loai_so_do"
            rules={[
              { required: true, message: "Vui lòng nhập loại sơ đồ" },
              {
                pattern: /^\d+x\d+$/,
                message: "Định dạng phải là SốHàngxSốCột (vd: 8x8)",
              },
              { validator: validateTotalSeats },
            ]}
          >
            <Input placeholder="Nhập loại sơ đồ (vd: 8x8)" />
          </Form.Item>

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

          <Form.Item
            label="Trạng thái"
            name="trang_thai"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select>
              <Option value={true}>Xuất bản</Option>
              <Option value={false}>Nháp</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Thêm phòng chiếu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddPhongChieu;
