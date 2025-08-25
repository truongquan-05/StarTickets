import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  DatePicker,
  message,
  Card,
  Typography,
  InputNumber,
  Input,
  Select,
  Col,
  Row,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import {
  useUpdateLichChieu,
  useListLichChieu,
  useListChuyenNgu,
  useListMovies,
  useListPhongChieu,
  useListCinemas,
} from "../../../hook/hungHook";
import { IMovies } from "../interface/movies";
import { IPhongChieu } from "../interface/phongchieu";
import { IChuyenNgu } from "../interface/chuyenngu";

const { Title } = Typography;

interface IRap {
  id: number;
  ten_rap: string;
}

const EditLichChieu = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [thoiLuongPhim, setThoiLuongPhim] = useState(0);
  const [selectedPhimId, setSelectedPhimId] = useState<number | null>(null);
  const [gioKetThucTinh, setGioKetThucTinh] = useState<string>("");

  // Lấy lịch chiếu
  const { data: lichChieuListRaw, isLoading: lichChieuLoading } =
    useListLichChieu({ resource: "lich_chieu" });
  const lichChieu = Array.isArray(lichChieuListRaw)
    ? lichChieuListRaw.find((item) => String(item.id) === id)
    : undefined;

  // Lấy danh sách phim, phòng chiếu và rạp
  const { data: phimListRaw, isLoading: phimLoading } = useListMovies({
    resource: "phim",
  });
  const phimList = Array.isArray(phimListRaw)
    ? phimListRaw
    : phimListRaw?.data || [];

  const { data: phongListRaw, isLoading: phongLoading } = useListPhongChieu({
    resource: "phong_chieu",
  });
  const phongList = Array.isArray(phongListRaw)
    ? phongListRaw
    : phongListRaw?.data || [];

  const { data: rapListRaw, isLoading: rapLoading } = useListCinemas({
    resource: "rap",
  });
  const rapList = Array.isArray(rapListRaw)
    ? rapListRaw
    : rapListRaw?.data || [];

  // Lấy danh sách chuyển ngữ theo phim
  const { data: chuyenNguListRaw } = useListChuyenNgu({
    resource: "chuyen_ngu",
    phimId: selectedPhimId ?? undefined,
  });
  const chuyenNguList = Array.isArray(chuyenNguListRaw)
    ? chuyenNguListRaw
    : chuyenNguListRaw?.data || [];

  // Khi load lichChieu và phimList thì set selectedPhimId, thoiLuongPhim và form
  useEffect(() => {
    if (lichChieu && phimList.length > 0) {
      setSelectedPhimId(lichChieu.phim_id);

      const phim = phimList.find((p: IMovies) => p.id === lichChieu.phim_id);
      const thoiLuong = phim?.thoi_luong ?? 0;
      setThoiLuongPhim(thoiLuong);

      const gioChieu = dayjs(lichChieu.gio_chieu);
      const gioKetThuc = gioChieu.add(thoiLuong, "minute");
      const gioKetThucFormatted = gioKetThuc.format("YYYY-MM-DD HH:mm:ss");
      setGioKetThucTinh(gioKetThucFormatted);

      // Lấy giá vé loại ghế "Đơn Thường" từ mảng gia_ve
      const giaVeDonThuong = Array.isArray(lichChieu.gia_ve)
        ? lichChieu.gia_ve.find((x: any) => x.ten_loai_ghe === "Ghế Thường")
            ?.pivot?.gia_ve
        : null;

      form.setFieldsValue({
        gio_chieu: gioChieu,
        gio_ket_thuc: gioKetThucFormatted,
        chuyen_ngu_id: lichChieu.chuyen_ngu_id,
        gia_ve: giaVeDonThuong ?? 0,
      });
    }
  }, [lichChieu, phimList, form]);

  // Khi đổi giờ chiếu thì tính lại giờ kết thúc
  const handleChangeGioChieu = (value: Dayjs | null) => {
    if (value && thoiLuongPhim > 0) {
      const gioKetThuc = value
        .add(thoiLuongPhim, "minute")
        .format("YYYY-MM-DD HH:mm:ss");
      setGioKetThucTinh(gioKetThuc);
      form.setFieldsValue({ gio_ket_thuc: gioKetThuc });
    } else {
      setGioKetThucTinh("");
      form.setFieldsValue({ gio_ket_thuc: "" });
    }
  };

  const { mutate: updateLichChieu } = useUpdateLichChieu({
    resource: "lich_chieu",
  });

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      if (!lichChieu) {
        message.error("Không tìm thấy lịch chiếu để cập nhật");
        setSubmitting(false);
        return;
      }

      const payload = {
        phim_id: selectedPhimId,
        phong_id: lichChieu.phong_id,
        gio_chieu: values.gio_chieu.format("YYYY-MM-DD HH:mm:ss"),
        gia_ve: values.gia_ve,
        chuyen_ngu_id: values.chuyen_ngu_id,
        gio_ket_thuc: gioKetThucTinh,
        ly_do: values.ly_do
      };

      updateLichChieu(
        { id: id!, values: payload },
        {
          onSuccess: () => {
            message.success("Cập nhật lịch chiếu thành công");
            navigate("/admin/lichchieu/list");
          },
          onError: (error: any) => {
            message.error(error.response.data.message);

            setSubmitting(false);
          },
        }
      );
    } catch (e) {
      message.error("Lỗi hệ thống");
      setSubmitting(false);
    }
  };

  if (lichChieuLoading || phimLoading || phongLoading || rapLoading)
    return <div>Loading...</div>;
  if (!lichChieu) return <div>Không tìm thấy lịch chiếu</div>;

  // Tìm tên phim, phòng, rạp theo ID
  const tenPhim =
    phimList.find((p: IMovies) => p.id === lichChieu.phim_id)?.ten_phim || "";
  const phongSelected = phongList.find(
    (p: IPhongChieu) => p.id === lichChieu.phong_id
  );
  const tenPhong = phongSelected?.ten_phong || "";

  // Từ phòng lấy ra rap_id và tìm rạp
  const rapId = phongSelected?.rap_id;
  const tenRap = rapList.find((r: IRap) => r.id === rapId)?.ten_rap || "";

  return (
    <Card
      style={{
        maxHeight: "78vh",
        padding: "2rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        borderRadius: "12px",
      }}
    >
      <Title level={3} style={{ textAlign: "center", marginBottom: 32 }}>
        🎬 Chỉnh sửa lịch chiếu
      </Title>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={24}>
          {/* Cột trái - thông tin chi tiết (readonly) */}
          <Col span={12}>
            <Form.Item label="Rạp">
              <Input value={tenRap} readOnly />
            </Form.Item>

            <Form.Item label="Phim">
              <Input value={tenPhim} readOnly />
            </Form.Item>

            <Form.Item label="Phòng chiếu">
              <Input value={tenPhong} readOnly />
            </Form.Item>
          </Col>

          {/* Cột phải - các trường người dùng thao tác */}
          <Col span={12}>
            <Form.Item
              name="chuyen_ngu_id"
              label="🌐 Chuyển ngữ"
              rules={[{ required: true, message: "Vui lòng chọn chuyển ngữ" }]}
            >
              <Select placeholder="Chọn chuyển ngữ">
                {chuyenNguList.map((cn: IChuyenNgu) => (
                  <Select.Option key={cn.id} value={cn.id}>
                    {cn.the_loai}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="gia_ve"
              label="💸 Giá vé (Đơn thường)"
              rules={[{ required: true, message: "Vui lòng nhập giá vé" }]}
            >
              <InputNumber<number>
                style={{ width: "100%" }}
                min={0}
                placeholder="Nhập giá vé (vd: 70000)"
              />
            </Form.Item>

            <Form.Item
              name="gio_chieu"
              label="🕒 Giờ chiếu"
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
                onChange={handleChangeGioChieu}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="🕓 Giờ kết thúc">
          <Input value={gioKetThucTinh} readOnly />
        </Form.Item>
        <Form.Item name="ly_do" label="Lý do rời lịch">
          <Input
            style={{ width: "100%" }}
            min={0}
            placeholder="Nhập giá vé (vd: 70000)"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            block
            size="large"
            style={{ marginTop: 24 }}
          >
            ✅ Cập nhật lịch chiếu
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EditLichChieu;
