import React, { useState } from "react";
import {
  Form,
  Select,
  Button,
  DatePicker,
  message,
  Card,
  Typography,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  useCreateLichChieu,
  useListMovies,
  useListPhongChieu,
} from "../../../hook/hungHook";

const { Option } = Select;
const { Title } = Typography;

const AddLichChieu = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const { data: phimListRaw, isLoading: phimLoading } = useListMovies({
    resource: "phim",
  });
  const { data: phongListRaw, isLoading: phongLoading } = useListPhongChieu({
    resource: "phong_chieu",
  });

  const phimList = Array.isArray(phimListRaw)
    ? phimListRaw
    : phimListRaw?.data || [];
  const phongList = Array.isArray(phongListRaw)
    ? phongListRaw
    : phongListRaw?.data || [];

  const { mutate: createLichChieu } = useCreateLichChieu({
    resource: "lich_chieu",
  });

  const onFinish = (values: any) => {
  if (!values.gio_chieu || !values.gio_ket_thuc) {
    message.error("Vui lòng chọn đầy đủ giờ chiếu và giờ kết thúc");
    return;
  }

  // So sánh trực tiếp timestamp, không dùng isSameOrBefore
  if ((values.gio_ket_thuc as Dayjs).valueOf() <= (values.gio_chieu as Dayjs).valueOf()) {
    message.error("Giờ kết thúc phải lớn hơn giờ chiếu");
    return;
  }

  setSubmitting(true);

  const payload = {
    ...values,
    gio_chieu: (values.gio_chieu as Dayjs).format("YYYY-MM-DD HH:mm:ss"),
    gio_ket_thuc: (values.gio_ket_thuc as Dayjs).format("YYYY-MM-DD HH:mm:ss"),
  };
  console.log(payload);

  createLichChieu(payload, {
    onSuccess: () => {
      message.success("Thêm lịch chiếu thành công");
      form.resetFields();
      setSubmitting(false);
    },
    onError: () => {
      message.error("Thêm lịch chiếu thất bại");
      setSubmitting(false);
    },
  });
};


  return (
    <Card style={{ maxWidth: 600, margin: "0 auto" }}>
      <Title level={3}>Thêm lịch chiếu mới</Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="phim_id"
          label="Phim"
          rules={[{ required: true, message: "Vui lòng chọn phim" }]}
        >
          <Select
            placeholder="Chọn phim"
            loading={phimLoading}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            disabled={phimLoading}
          >
            {phimList.map((phim: any) => (
              <Option key={phim.id} value={phim.id}>
                {phim.ten_phim}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="phong_id"
          label="Phòng chiếu"
          rules={[{ required: true, message: "Vui lòng chọn phòng chiếu" }]}
        >
          <Select
            placeholder="Chọn phòng chiếu"
            loading={phongLoading}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            disabled={phongLoading}
          >
            {phongList.map((phong: any) => (
              <Option key={phong.id} value={phong.id}>
                {phong.ten_phong}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="gio_chieu"
          label="Giờ chiếu"
          rules={[{ required: true, message: "Vui lòng chọn giờ chiếu" }]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            disabledDate={(current) => current && current < dayjs().startOf("day")}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="gio_ket_thuc"
          label="Giờ kết thúc"
          rules={[{ required: true, message: "Vui lòng chọn giờ kết thúc" }]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            disabledDate={(current) => current && current < dayjs().startOf("day")}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={submitting}
            disabled={submitting}
          >
            Thêm lịch chiếu
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddLichChieu;
