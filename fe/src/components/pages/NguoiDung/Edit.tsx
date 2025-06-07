import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserForm from "../../User/UserForm";
import { getUserById } from "../../provider/duProvider";
import { User } from "../../types/Uses";
import { useUpdateUser } from "../../hook/duHook";

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const { mutate: updateUser } = useUpdateUser({ resource: "nguoi_dung" });
  

  useEffect(() => {
   if (id) getUserById(+id).then(res => setUser(res));
  }, [id]);

  const handleSubmit = (data: any) => {
  if (id) {
    updateUser({
      id,
      values:data
    })
  }
};


  if (!user) return <div>Đang tải...</div>;

  return <UserForm initialData={user} onSubmit={handleSubmit} />;
};

export default UserEdit;