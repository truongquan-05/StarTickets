import { useState, useEffect } from "react";
import {
  Form,
  Select,
  Button,
  DatePicker,
  message,
  Card,
  Typography,
  Col,
  Row,
  Input,
  InputNumber,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  useCreateLichChieu,
  useListMovies,
  useListPhongChieu,
  useListChuyenNgu,
  useCheckLichChieu,
  useCreateGiaVe,
} from "../../../hook/hungHook";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { getListCinemas } from "../../../provider/hungProvider";

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
  const { data: phongListRaw } = useListPhongChieu({
    resource: "phong_chieu",
  });

  const [rapListRaw, setRapListRaw] = useState<any>([]);
  const [rapLoading, setRapLoading] = useState<boolean>(false);
  const { mutate: createGiaVe } = useCreateGiaVe({ resource: "gia_ve" });

  useEffect(() => {
    let isMounted = true;
    setRapLoading(true);
    getListCinemas({ resource: "rap" })
      .then((result) => {
        if (isMounted) {
          setRapListRaw(result);
        }
      })
      .finally(() => {
        if (isMounted) setRapLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Xử lý dữ liệu đầu vào (có thể là array hoặc object có .data)
  const rapLis = Array.isArray(rapListRaw)
    ? rapListRaw
    : rapListRaw?.data || [];
  const phongList = Array.isArray(phongListRaw)
    ? phongListRaw
    : phongListRaw?.data || [];

  const [selectedRapId, setSelectedRapId] = useState<number | null>(null);

  // Khi chọn rạp, cập nhật selectedRapId và reset trường phòng chiếu
  const handleChangeRap = (rapId: number) => {
    setSelectedRapId(rapId);
    form.setFieldsValue({ phong_id: undefined }); // Đặt lại giá trị phòng chiếu
  };

  const { data: chuyenNguListRaw, isLoading: chuyenNguLoading } =
    useListChuyenNgu({
      resource: "chuyen_ngu",
      phimId: selectedPhimId ?? undefined,
    });

  const phimList = Array.isArray(phimListRaw)
    ? phimListRaw
    : phimListRaw?.data || [];

  const chuyenNguList = Array.isArray(chuyenNguListRaw)
    ? chuyenNguListRaw
    : chuyenNguListRaw?.data || [];

  const { mutate: createLichChieu } = useCreateLichChieu({
    resource: "lich_chieu",
  });

  const { mutateAsync: checkLichChieu } = useCheckLichChieu({
    resource: "lich_chieu/check",
  });

  const [showMoreSchedule, setShowMoreSchedule] = useState(false);

  const handleChangePhim = (phimId: number) => {
    setSelectedPhimId(phimId);
    const phim = phimList.find((p: any) => p.id === phimId);
    if (phim && typeof phim.thoi_luong === 'number') { // Kiểm tra kiểu dữ liệu thoi_luong
      setThoiLuongPhim(phim.thoi_luong);
      const gioChieuField = form.getFieldValue("gio_chieu");
      if (
        gioChieuField &&
        dayjs.isDayjs(gioChieuField) // Sử dụng dayjs.isDayjs để kiểm tra
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
      // Format giờ chiếu chính
      if (values.gio_chieu && dayjs.isDayjs(values.gio_chieu)) {
        values.gio_chieu = values.gio_chieu.format("YYYY-MM-DD HH:mm:ss");
      }

      values.gio_ket_thuc = gioKetThucTinh;

      // Xử lý các lịch chiếu thêm
      const lichChieuThem = (values.lich_chieu_them || []).map((item: any) => ({
        gio_chieu: item.gio_chieu && dayjs.isDayjs(item.gio_chieu)
          ? item.gio_chieu.format("YYYY-MM-DD HH:mm:ss")
          : null,
        gio_ket_thuc: item.gio_ket_thuc || null,
        chuyen_ngu_id: item.chuyen_ngu_id || null,
        gia_ve: item.gia_ve // Đảm bảo trường giá vé được gửi đi
      }));

      const payload = {
        ...values,
        lich_chieu_them: lichChieuThem,
      };

      // Kiểm tra trùng lịch
      const checkResult = await checkLichChieu({
        phong_id: values.phong_id,
        gio_chieu: values.gio_chieu,
        gio_ket_thuc: values.gio_ket_thuc,
        lich_chieu_them: lichChieuThem,
      });

      if (checkResult.isConflict) {
        message.error("Lịch chiếu bị trùng hoặc quá gần lịch chiếu hiện tại!");
        setSubmitting(false);
        return;
      }

      // Gửi tạo lịch chiếu
      createLichChieu(payload, {
        onSuccess: async (res: any) => {
          const lichChieuId = res?.id;
          const giaVe = form.getFieldValue("gia_ve");

          if (lichChieuId && giaVe !== undefined) {
            try {
              await createGiaVe({
                lich_chieu_id: lichChieuId,
                gia_ve: giaVe,
              });
            } catch (e: any) {
              let errorMessage = "Tạo giá vé thất bại";
              if (e.response && e.response.data && e.response.data.message) {
                errorMessage = e.response.data.message;
              } else if (e.message) {
                errorMessage = e.message;
              }
              message.error(errorMessage);
            }
          }

          message.success("Thêm lịch chiếu thành công");

          form.resetFields();
          setGioKetThucTinh("");
          setThoiLuongPhim(0);
          setSelectedPhimId(null);
          setSelectedRapId(null);
          setShowMoreSchedule(false); // Reset trạng thái hiển thị lịch chiếu thêm
          setSubmitting(false);
        },
        onError: (error: any) => {
          console.error("Lỗi khi tạo lịch chiếu:", error);
          let errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại.";

          if (error.response) {
            const { status, data } = error.response;

            if (status === 422 && data.errors) {
              errorMessage = "Dữ liệu không hợp lệ:";
              Object.entries(data.errors).forEach(([field, messages]) => {
                if (Array.isArray(messages)) {
                  messages.forEach((msg) => {
                    errorMessage += `\n- ${msg}`;
                  });
                } else {
                  errorMessage += `\n- ${messages}`;
                }
              });
            } else if (data.message) {
              errorMessage = data.message;
            } else {
              errorMessage = `Lỗi ${status}: ${error.response.statusText || 'Lỗi không xác định từ máy chủ'}`;
            }
          } else if (error.request) {
            errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.";
          } else {
            errorMessage = error.message || "Đã có lỗi không mong muốn xảy ra.";
          }
          message.error(errorMessage);
          setSubmitting(false);
        },
      });
    } catch (error: any) {
      console.error("Lỗi trong quá trình submit form:", error);
      let errorMessage = "Đã có lỗi xảy ra trong quá trình kiểm tra lịch chiếu.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      message.error(errorMessage);
      setSubmitting(false);
    }
  };

  // Lọc phòng chiếu theo trạng thái hoạt động
  const phongListFiltered = phongList.filter(
    (phong: any) => phong.trang_thai === 1 || phong.trang_thai === "1"
  );

  // LỌC THEO RẠP ĐƯỢC CHỌN
  const phongListFilteredByRap = phongListFiltered.filter(
    (phong: any) => phong.rap_id === selectedRapId
  );

  // Hàm để vô hiệu hóa thời gian trong DatePicker (chỉ cho giờ chiếu chính và phụ)
  const disabledDateTime = (current: Dayjs | null) => {
    const now = dayjs();
    if (!current) {
      return {};
    }

    // Vô hiệu hóa ngày trong quá khứ
    if (current.isBefore(now.startOf('day'))) {
        return {
            disabledHours: () => Array.from({ length: 24 }, (_, i) => i),
            disabledMinutes: () => Array.from({ length: 60 }, (_, i) => i),
            disabledSeconds: () => Array.from({ length: 60 }, (_, i) => i),
        };
    }

    // Vô hiệu hóa giờ, phút, giây trong quá khứ nếu là ngày hiện tại
    if (current.isSame(now, 'day')) {
      return {
        disabledHours: () => Array.from({ length: now.hour() }, (_, i) => i),
        disabledMinutes: (selectedHour: number) => {
          if (selectedHour === now.hour()) {
            return Array.from({ length: now.minute() }, (_, i) => i);
          }
          return [];
        },
        disabledSeconds: (selectedHour: number, selectedMinute: number) => {
          if (selectedHour === now.hour() && selectedMinute === now.minute()) {
            return Array.from({ length: now.second() }, (_, i) => i);
          }
          return [];
        },
      };
    }
    return {};
  };


  return (
    <Card
      style={{
        maxWidth: 1500,
        margin: "0 auto",
        padding: "5%",
        height: "100%",
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Title level={3} style={{ textAlign: "center", marginBottom: 32 }}>
        Thêm lịch chiếu mới
      </Title>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="phim_id"
              label="Phim"
              rules={[{ required: true, message: "Vui lòng chọn phim" }]}
            >
              <Select
                placeholder="Chọn phim"
                loading={phimLoading}
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) => {
                  const label = option?.label;
                  if (typeof label === "string") {
                    return label.toLowerCase().includes(input.toLowerCase());
                  }
                  return false;
                }}
                options={phimList.map((phim: any) => ({
                  label: phim.ten_phim,
                  value: phim.id,
                }))}
                onChange={handleChangePhim}
                disabled={phimLoading}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="rap_id"
              label="Rạp chiếu"
              rules={[{ required: true, message: "Vui lòng chọn rạp chiếu" }]}
            >
              <Select
                placeholder="Chọn rạp chiếu"
                showSearch
                loading={rapLoading}
                onChange={handleChangeRap}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {rapLis.map((rap: any) => (
                  <Option key={rap.id} value={rap.id}>
                    {rap.ten_rap}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="phong_id"
              label="Phòng chiếu"
              rules={[{ required: true, message: "Vui lòng chọn phòng chiếu" }]}
            >
              <Select
                placeholder="Chọn phòng chiếu"
                disabled={!selectedRapId}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {phongListFilteredByRap.map((phong: any) => (
                  <Option key={phong.id} value={phong.id}>
                    {phong.ten_phong}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
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
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="gio_chieu"
              label="Giờ chiếu"
              rules={[
                { required: true, message: "Vui lòng chọn giờ chiếu" },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    if (dayjs.isDayjs(value) && value.isBefore(dayjs())) { // Kiểm tra isDayjs trước khi so sánh
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
                  current && current.isBefore(dayjs().startOf("day")) // Sử dụng isBefore thay vì <
                }
                disabledTime={disabledDateTime}
                onChange={handleChangeGioChieu}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label="Giờ kết thúc (tự động tính)">
              <Input
                type="text"
                readOnly
                value={gioKetThucTinh}
                style={{
                  width: "100%",
                  padding: "5px",
                  outline: "none",
                  backgroundColor: "#f5f5f5",
                  border: "1px solid #d9d9d9",
                  borderRadius: 4,
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="gia_ve"
              label="Giá vé chính"
              rules={[{ required: true, message: "Vui lòng nhập giá vé" }]}
            >
              <InputNumber<number> // Đã sửa lỗi TypeScript tại đây
                placeholder="Giá Vé"
                min={0}
                max={1000000000}
                step={1000}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, ""))}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.List name="lich_chieu_them">
          {(fields, { add, remove }) => (
            <>
              <Form.Item>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setShowMoreSchedule(true);
                    if (fields.length === 0) add();
                  }}
                  // Chỉ cho phép thêm lịch chiếu phụ khi đã chọn phim và phòng
                  disabled={!selectedPhimId || !form.getFieldValue('phong_id')} 
                >
                  Thêm lịch chiếu khác
                </Button>
              </Form.Item>

              {showMoreSchedule && (
                <Card
                  type="inner"
                  title="Các lịch chiếu thêm"
                  style={{ marginBottom: 24, background: "#fafafa" }}
                >
                  {fields.map(({ key, name, ...restField }) => (
                    <Row
                      gutter={16}
                      key={key}
                      align="middle"
                      style={{ marginBottom: 16 }}
                    >
                      <Col xs={24} sm={11}>
                        <Form.Item
                          {...restField}
                          name={[name, "gio_chieu"]}
                          label="Giờ chiếu"
                          rules={[
                            { required: true, message: "Chọn giờ chiếu" },
                            {
                                validator: (_, value) => {
                                    if (!value) return Promise.resolve();
                                    if (dayjs.isDayjs(value) && value.isBefore(dayjs())) {
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
                            disabledDate={(current) =>
                                current && current.isBefore(dayjs().startOf("day"))
                            }
                            disabledTime={disabledDateTime} // Áp dụng cho các lịch chiếu phụ
                            format="YYYY-MM-DD HH:mm:ss"
                            style={{ width: "100%" }}
                            onChange={(value) => {
                              const currentLichChieuThem = form.getFieldValue("lich_chieu_them") || [];
                              const updatedLichChieuThem = [...currentLichChieuThem];
                              if (value && thoiLuongPhim > 0) {
                                const gio_ket_thuc = value.add(
                                  thoiLuongPhim,
                                  "minute"
                                );
                                updatedLichChieuThem[name] = {
                                  ...updatedLichChieuThem[name],
                                  gio_ket_thuc: gio_ket_thuc.format(
                                    "YYYY-MM-DD HH:mm:ss"
                                  ),
                                };
                              } else {
                                updatedLichChieuThem[name] = {
                                  ...updatedLichChieuThem[name],
                                  gio_ket_thuc: "",
                                };
                              }
                              form.setFieldsValue({
                                lich_chieu_them: updatedLichChieuThem,
                              });
                            }}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={11}>
                        <Form.Item label="Giờ kết thúc (tự động)">
                          <Input
                            value={
                              form.getFieldValue("lich_chieu_them")?.[name]
                                ?.gio_ket_thuc || ""
                            }
                            readOnly
                          />
                        </Form.Item>
                      </Col>

                      <Col
                        xs={24}
                        sm={2}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MinusCircleOutlined
                          onClick={() => {
                            remove(name);
                            // Nếu không còn lịch chiếu phụ nào, ẩn Card
                            if (fields.length === 1) { // 1 là số lượng field trước khi remove
                                setShowMoreSchedule(false);
                            }
                          }}
                          style={{
                            fontSize: 20,
                            color: "red",
                            cursor: "pointer",
                          }}
                        />
                      </Col>

                      <Col xs={24} sm={11}>
                        <Form.Item
                          {...restField}
                          name={[name, "chuyen_ngu_id"]}
                          label="Chuyển Ngữ"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn chuyển ngữ",
                            },
                          ]}
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
                      </Col>
                      <Col xs={24} sm={11}>
                        <Form.Item
                          name={[name, "gia_ve"]}
                          label="Giá vé"
                          rules={[
                            { required: true, message: "Vui lòng nhập giá vé" },
                          ]}
                        >
                          <InputNumber<number> // Đã sửa lỗi TypeScript tại đây
                            min={0}
                            max={1000000000}
                            step={1000}
                            formatter={(value) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) =>
                              Number(value!.replace(/\$\s?|(,*)/g, ""))
                            }
                            placeholder="Giá Vé"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      style={{ width: 180, padding: 10 }}
                      icon={<PlusOutlined />}
                    >
                      Thêm 1 dòng lịch chiếu
                    </Button>
                  </Form.Item>
                </Card>
              )}
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={submitting}
            disabled={submitting}
            style={{ marginTop: 24 }}
          >
            Thêm lịch chiếu
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddLichChieu;