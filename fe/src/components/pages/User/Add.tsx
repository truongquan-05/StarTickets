import { message } from "antd";
import UserForm from "../../../components/User/UserForm";
import { useCreateUser } from "../../hook/duHook";

const UserAdd = () => {
   const { mutate: createUser } = useCreateUser({ resource: "users" });
  const handleSubmit = (data: any) => {
    try {
      createUser(data)
    } catch {
      message.error("Xoá thất bại, vui lòng thử lại");
    }
};


  return <UserForm onSubmit={handleSubmit} />;
};

export default UserAdd;
