// pages/Admin/Banner/BannerEdit.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, message, Spin, Typography } from "antd";
import { getBannerById, updateBanner } from "../../../provider/duProvider";
import BannerForm from "././BannerForm";

const { Title } = Typography;

const BannerEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<any>(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const data = await getBannerById(Number(id));
        setBanner(data);
      } catch (error) {
        message.error("Không thể tải banner");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBanner();
  }, [id]);

  const handleUpdate = async (values: any) => {
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("link_url", values.link_url);
    formData.append("start_date", values.range[0].format("YYYY-MM-DD"));
    formData.append("end_date", values.range[1].format("YYYY-MM-DD"));
    formData.append("is_active", values.is_active ? "1" : "0");

    // Thêm ảnh nếu có thay đổi
    if (values.image_url?.file?.originFileObj) {
      formData.append("image", values.image_url.file.originFileObj);
    }

    try {
      await updateBanner(Number(id), formData);
      message.success("Cập nhật banner thành công!");
      navigate("/admin/banners");
    } catch (error) {
      message.error("Cập nhật banner thất bại");
    }
  };

  if (loading) return <Spin tip="Đang tải banner..." />;

  return (
    <Card>
      <Title level={3}>Chỉnh sửa banner</Title>
      <BannerForm initialValues={banner} onFinish={handleUpdate} />
    </Card>
  );
};

export default BannerEdit;
