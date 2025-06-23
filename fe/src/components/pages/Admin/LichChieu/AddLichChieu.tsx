import React, { useState } from "react";
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
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  useCreateLichChieu,
  useListMovies,
  useListPhongChieu,
  useListChuyenNgu,
  useCheckLichChieu,
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

  React.useEffect(() => {
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

  const rapLis = Array.isArray(rapListRaw)
    ? rapListRaw
    : rapListRaw?.data || [];
  const phongList = Array.isArray(phongListRaw)
    ? phongListRaw
    : phongListRaw?.data || [];

  const [selectedRapId, setSelectedRapId] = useState<number | null>(null);

  const handleChangeRap = (rapId: number) => {
    setSelectedRapId(rapId);
    form.setFieldsValue({ phong_id: undefined });
  };
  const filteredPhongList = phongList.filter(
    (phong: any) => phong.rap_id === selectedRapId
  );

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
      // Format giờ chiếu chính
      if (values.gio_chieu && (values.gio_chieu as Dayjs).format) {
        values.gio_chieu = (values.gio_chieu as Dayjs).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }

      values.gio_ket_thuc = gioKetThucTinh;

      // Xử lý các lịch chiếu thêm
      const lichChieuThem = (values.lich_chieu_them || []).map((item: any) => ({
        gio_chieu: item.gio_chieu
          ? dayjs(item.gio_chieu).format("YYYY-MM-DD HH:mm:ss")
          : null,
        gio_ket_thuc: item.gio_ket_thuc || null,
      }));

      const payload = {
        ...values,
        lich_chieu_them: lichChieuThem,
      };

      // Kiểm tra trùng giờ với giờ chiếu chính
      const checkResult = await checkLichChieu({
        phong_id: values.phong_id,
        gio_chieu: values.gio_chieu,
        gio_ket_thuc: values.gio_ket_thuc,

        lich_chieu_them: lichChieuThem,
      });

      if (checkResult.isConflict) {
        // message.error(
        //   "Lịch chiếu bị trùng hoặc quá gần lịch chiếu hiện tại trong phòng!"
        // );
        setSubmitting(false);
        return;
      }

      // Gửi tạo lịch chiếu (gồm cả chính và thêm)
      createLichChieu(payload, {
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
            Object.entries(apiErrors).forEach(([field, messages]) => {
              if (Array.isArray(messages)) {
                messages.forEach((msg) => {
                  message.error(`${field}: ${msg}`);
                });
              } else {
                message.error(`${field}: ${messages}`);
              }
            });
          } else {
            message.error("Đã có lỗi xảy ra");
          }
          setSubmitting(false);
        },
      });
    } catch (error: any) {
      console.error(error);
      message.error(error.response.data.message);
      setSubmitting(false);
    }
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
              label="Rạp chiếu"
              rules={[{ required: true, message: "Vui lòng chọn phòng rạp" }]}
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
                mode="multiple"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {filteredPhongList.map((phong: any) => (
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
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label="Giờ kết thúc (tự động tính)">
              <input
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
        </Row>

        <Form.List name="lich_chieu_them">
          {(fields, { add, remove }) => (
            <>
              {/* Nút hiển thị thêm lịch */}
              <Form.Item>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setShowMoreSchedule(true);
                    if (fields.length === 0) add();
                  }}
                >
                  Thêm lịch chiếu khác
                </Button>
              </Form.Item>

              {/* Vùng hiển thị các form khi showMoreSchedule = true */}
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
                      {/* Giờ chiếu */}
                      <Col xs={24} sm={11}>
                        <Form.Item
                          {...restField}
                          name={[name, "gio_chieu"]}
                          label="Giờ chiếu"
                          rules={[
                            { required: true, message: "Chọn giờ chiếu" },
                          ]}
                        >
                          <DatePicker
                            showTime={{ format: "HH:mm:ss" }}
                            disabledDate={(current) =>
                              current && current < dayjs().startOf("day")
                            }
                            format="YYYY-MM-DD HH:mm:ss"
                            style={{ width: "100%" }}
                            onChange={(value) => {
                              const lich =
                                form.getFieldValue("lich_chieu_them") || [];
                              if (value && thoiLuongPhim > 0) {
                                const gio_ket_thuc = value.add(
                                  thoiLuongPhim,
                                  "minute"
                                );
                                lich[name] = {
                                  ...lich[name],
                                  gio_ket_thuc: gio_ket_thuc.format(
                                    "YYYY-MM-DD HH:mm:ss"
                                  ),
                                };
                              } else {
                                lich[name] = {
                                  ...lich[name],
                                  gio_ket_thuc: "",
                                };
                              }
                              form.setFieldsValue({
                                lich_chieu_them: [...lich],
                              });
                            }}
                          />
                        </Form.Item>
                      </Col>

                      {/* Giờ kết thúc */}
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

                      {/* Xóa */}
                      <Col xs={24} sm={2} style={{ textAlign: "center" }}>
                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          style={{ fontSize: 20, color: "red", marginTop: 30 }}
                        />
                      </Col>
                    </Row>
                  ))}

                  {/* Nút thêm dòng mới bên trong khối */}
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
