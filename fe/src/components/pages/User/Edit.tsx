import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserForm from "../../../components/User/UserForm";
import { getUserById } from "../../provider/duProvider";
import { User } from "../../types/Uses";
import { useUpdateUser } from "../../hook/duHook";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const { mutate: updateUser } = useUpdateUser({ resource: "users" });
  

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

export default Edit;