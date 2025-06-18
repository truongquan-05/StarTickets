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
  useListChuyenNgu,
  useCheckLichChieu,
} from "../../../hook/hungHook";

const { Option } = Select;
const { Title } = Typography;

const AddLichChieu = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const [thoiLuongPhim, setThoiLuongPhim] = useState<number>(0);
  const [gioKetThucTinh, setGioKetThucTinh] = useState<string>("");
  const [selectedPhimId, setSelectedPhimId] = useState<number | null>(null);

  const { data: phimListRaw, isLoading: phimLoading } = useListMovies({
    resource: "phim",
  });
  const { data: phongListRaw, isLoading: phongLoading } = useListPhongChieu({
    resource: "phong_chieu",
  });
  const { data: chuyenNguListRaw, isLoading: chuyenNguLoading } =
    useListChuyenNgu({
      resource: "chuyen_ngu",
      phimId: selectedPhimId ?? undefined,
    });

  const phimList = Array.isArray(phimListRaw)
    ? phimListRaw
    : phimListRaw?.data || [];
  const phongList = Array.isArray(phongListRaw)
    ? phongListRaw
    : phongListRaw?.data || [];
  const chuyenNguList = Array.isArray(chuyenNguListRaw)
    ? chuyenNguListRaw
    : chuyenNguListRaw?.data || [];

  const { mutate: createLichChieu } = useCreateLichChieu({
    resource: "lich_chieu",
  });

  const { mutateAsync: checkLichChieu } = useCheckLichChieu({
    resource: "lich_chieu/check",
  });

  const handleChangePhim = (phimId: number) => {
    setSelectedPhimId(phimId);
    const phim = phimList.find((p: any) => p.id === phimId);
    if (phim && phim.thoi_luong) {
      setThoiLuongPhim(phim.thoi_luong);
      const gioChieuField = form.getFieldValue("gio_chieu");
      if (
        gioChieuField &&
        gioChieuField.isValid &&
        typeof gioChieuField.add === "function"
      ) {
        const ketThuc = gioChieuField.add(phim.thoi_luong, "minute");
        setGioKetThucTinh(ketThuc.format("YYYY-MM-DD HH:mm:ss"));
      } else {
        setGioKetThucTinh("");
      }
    } else {
      setThoiLuongPhim(0);
      setGioKetThucTinh("");
    }
  };
  const handleChangeGioChieu = (value: Dayjs | null) => {
    if (value && thoiLuongPhim > 0) {
      const ketThuc = value.add(thoiLuongPhim, "minute");
      setGioKetThucTinh(ketThuc.format("YYYY-MM-DD HH:mm:ss"));
    } else {
      setGioKetThucTinh("");
    }
  };

  const onFinish = async (values: any) => {
    setSubmitting(true);

    try {
      if (values.gio_chieu && (values.gio_chieu as Dayjs).format) {
        values.gio_chieu = (values.gio_chieu as Dayjs).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }

      values.gio_ket_thuc = gioKetThucTinh;

      // Gọi API kiểm tra lịch chiếu trùng + cách nhau ít nhất 15 phút
      const checkResult = await checkLichChieu({
        phong_id: values.phong_id,
        gio_chieu: values.gio_chieu,
        gio_ket_thuc: values.gio_ket_thuc,
      });

      if (checkResult.isConflict) {
        message.error(
          "Lịch chiếu bị trùng hoặc thời gian chiếu mới quá gần lịch hiện tại trong phòng này!"
        );
        setSubmitting(false);
        return;
      }

      // Nếu không trùng mới tạo lịch chiếu
      createLichChieu(values, {
        onSuccess: () => {
          message.success("Thêm lịch chiếu thành công");
          form.resetFields();
          setGioKetThucTinh("");
          setThoiLuongPhim(0);
          setSelectedPhimId(null);
          setSubmitting(false);
        },
        onError: (error: any) => {
          if (
            error.response &&
            error.response.status === 422 &&
            error.response.data.errors
          ) {
            const apiErrors = error.response.data.errors;

            const allErrors = Object.values(apiErrors)
              .map((messages) =>
                Array.isArray(messages) ? messages.join("\n") : messages
              )
              .join("\n");

            message.error(allErrors, 5);
          } else {
            message.error("Thêm lịch chiếu thất bại");
          }
          setSubmitting(false);
        },
      });
    } catch (error) {
      console.error(error);
      message.error("Phòng này đang hoạt động vào thời gian đó");
      setSubmitting(false);
    }
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
            onChange={handleChangePhim}
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
          name="chuyen_ngu_id"
          label="Chuyển Ngữ"
          rules={[{ required: true, message: "Vui lòng chọn chuyển ngữ" }]}
        >
          <Select
            placeholder="Chọn chuyển ngữ"
            loading={chuyenNguLoading}
            showSearch
            optionFilterProp="children"
            disabled={!selectedPhimId || chuyenNguLoading}
            filterOption={(input, option) =>
              (option?.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {chuyenNguList.map((cn: any) => (
              <Option key={cn.id} value={cn.id}>
                {cn.the_loai}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="gio_chieu"
          label="Giờ chiếu"
          rules={[
            { required: true, message: "Vui lòng chọn giờ chiếu" },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                if (value.isBefore(dayjs())) {
                  return Promise.reject(
                    new Error("Không được chọn thời gian trong quá khứ")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <DatePicker
            showTime={{ format: "HH:mm:ss" }}
            format="YYYY-MM-DD HH:mm:ss"
            style={{ width: "100%" }}
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }
            disabledTime={(current) => {
              if (!current) return {};
              const now = dayjs();
              if (current.isSame(now, "day")) {
                return {
                  disabledHours: () =>
                    Array.from({ length: 24 }, (_, i) =>
                      i < now.hour() ? i : -1
                    ).filter((i) => i !== -1),
                  disabledMinutes: (selectedHour) =>
                    selectedHour === now.hour()
                      ? Array.from({ length: 60 }, (_, i) =>
                          i < now.minute() ? i : -1
                        ).filter((i) => i !== -1)
                      : [],
                  disabledSeconds: (selectedHour, selectedMinute) =>
                    selectedHour === now.hour() &&
                    selectedMinute === now.minute()
                      ? Array.from({ length: 60 }, (_, i) =>
                          i < now.second() ? i : -1
                        ).filter((i) => i !== -1)
                      : [],
                };
              }
              return {};
            }}
            onChange={handleChangeGioChieu}
          />
        </Form.Item>

        {gioKetThucTinh && (
          <Form.Item label="Giờ kết thúc (tự động tính)">
            <input
              type="text"
              readOnly
              value={gioKetThucTinh}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#f5f5f5",
                border: "1px solid #d9d9d9",
                borderRadius: 4,
              }}
            />
          </Form.Item>
        )}

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
