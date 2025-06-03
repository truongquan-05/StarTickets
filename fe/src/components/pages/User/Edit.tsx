import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserForm from "../../../components/User/UserForm";
import { getUserById, updateUser } from "../../provider/index";
import { User } from "../../types/Uses";
import { message } from "antd";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (id) getUserById(+id).then(res => setUser(res.data));
  }, [id]);

  const handleSubmit = (data: any) => {
  if (id) {
    updateUser(+id, data).then(() => {
      message.success("Cập nhật thành công");
      navigate("/users");
    }).catch(() => {
      message.error("Cập nhật thất bại, vui lòng thử lại");
    });
  }
};


  if (!user) return <div>Đang tải...</div>;

  return <UserForm initialData={user} onSubmit={handleSubmit} />;
};

export default Edit;