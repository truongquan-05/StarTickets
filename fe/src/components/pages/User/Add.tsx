import { message } from "antd";
import UserForm from "../../../components/User/UserForm";
import { createUser } from "../../provider/index";
import { useNavigate } from "react-router-dom";

const UserAdd = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
  createUser(data)
    .then(() => {
      message.success("Thêm thành công");
      navigate("/users");
    })
    .catch(() => {
      message.error("Thêm thất bại, vui lòng thử lại");
    });
};


  return <UserForm onSubmit={handleSubmit} />;
};

export default UserAdd;
