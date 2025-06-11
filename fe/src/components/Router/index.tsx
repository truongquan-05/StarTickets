// src/Router/index.tsx
import { useRoutes } from 'react-router-dom';
import Admin from '../Layouts/AdminLayout/Admin';
import User from '../Layouts/UserLayout/User';
import ListCategoryChair from '../pages/Admin/CategoryChairPage/ListCategoryChair';
import AddMoviesPage from '../pages/Admin/MoviesPage/AddMoviesPage';
import List from '../pages/Admin/MoviesPage/List';
import DashboardAdmin from '../pages/Admin/DashboardAdmin';
import ListCinemas from '../pages/CinemasPage/ListCinemas';
import AddCinemasPage from '../pages/CinemasPage/AddCinemaForm';
import FoodList from '../pages/Food/List';
import FoodAdd from '../pages/Food/Add';
import FoodEdit from '../pages/Food/Edit';
import UserList from '../pages/NguoiDung/List';
import GenresManager from '../GenresManager';
import DashboardUser from '../pages/User/Dashboard';
import LichChieu from '../pages/Admin/LichChieu/LichChieu';
import VaiTro from '../pages/NguoiDung/VaiTro';
import PhanHoiNguoiDung from '../pages/Admin/CommentPage/PhanHoiNguoiDung';
import ListPhongChieu from '../pages/Admin/PhongChieu/ListPhongChieu';
import AddPhongChieu from '../pages/Admin/PhongChieu/AddPhongChieu';







const Routermain = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <User />,
      children: [
        { path: '/', element: <DashboardUser /> },
      ],
    },
    {
      path: '/admin',
      element: <Admin />,
      children: [
        { path: '', element: <DashboardAdmin /> },
        { path: 'movies/list', element: <List /> },
        { path: 'movies/add', element: <AddMoviesPage /> },
        { path: 'category_chair/list', element: <ListCategoryChair /> },
        { path: 'lichchieu/list', element: <LichChieu /> },
        { path: 'cinemas/list', element: <ListCinemas /> },
        { path: 'cinemas/add', element: <AddCinemasPage /> },
        { path: 'room/list', element: <ListPhongChieu /> },
        { path: 'room/add', element: <AddPhongChieu /> },

        { path: 'comment/phanhoinguoidung', element: <PhanHoiNguoiDung /> },



        { path: 'users', element: <UserList/> },
        { path: 'vaitro', element: <VaiTro/> },

        { path: 'genre', element: <GenresManager/> },
        
        { path: 'food', element: <FoodList /> },
        { path: 'food/add', element: <FoodAdd /> },
        { path: 'food/edit/:id', element: <FoodEdit /> },
        { path: 'vouchers/list', element: <VouchersList /> },
      ],
    },
  ]);

  return <>{element}</>;
};

export default Routermain;