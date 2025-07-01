// src/Router/index.tsx
import { useRoutes } from 'react-router-dom';
import Admin from '../Layouts/AdminLayout/Admin';
import User from '../Layouts/UserLayout/User';
import ListCategoryChair from '../pages/Admin/Chair/ListCategoryChair';
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
import LichChieu from '../pages/Admin/LichChieu/LichChieu';
import VaiTro from '../pages/NguoiDung/VaiTro';
import PhanHoiNguoiDung from '../pages/Admin/CommentPage/PhanHoiNguoiDung';
import ListPhongChieu from '../pages/Admin/PhongChieu/ListPhongChieu';
import AddPhongChieu from '../pages/Admin/PhongChieu/AddPhongChieu';
import VouchersList from '../pages/Voucher/List';
import Chair from '../pages/Admin/Chair/Chair';
import AddLichChieu from '../pages/Admin/LichChieu/AddLichChieu';
import Home from '../pages/Users/Home';
import PhongChieuChuaXuat from '../pages/Admin/PhongChieu/PhongChieuChuaXuat';
import LichChieuCu from '../pages/Admin/LichChieu/LichChieuCu';
import PhongChieuXoaMem from '../pages/Admin/PhongChieu/PhongChieuXoaMem';
import MovieDetail from '../pages/Admin/MoviesPage/ChiTietPhim';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import GioiThieu from '../pages/Users/GioiThieu';
import ListNews from '../pages/Admin/News/ListNews';
import AddNews from '../pages/Admin/News/AddNews';
import NewsUser from '../pages/Users/TinTuc/NewsUser';
import NewsDetail from '../pages/Users/TinTuc/NewsDetail';
import GoogleCallback from '../pages/auth/GoogleCallback';
import AddVoucher from '../pages/Voucher/Add';
import SearchPage from '../pages/Users/SearchPage';
import MovieDetailUser from '../pages/Users/MovieDetail';
import EditLichChieu from '../pages/Admin/LichChieu/EditLichChieu';
import Comment from '../pages/Admin/CommentPage/Comment';
import ProfilePage from '../pages/Users/Profile';
import TimKiemPhim from '../pages/Users/Timkiemphim';
import ListDanhGia from '../pages/Admin/DanhGia/ListDanhGia';
import TrashMovies from '../pages/Admin/MoviesPage/TrashMovies';







const Routermain = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <User />,
      children: [
        { path: '', element: <Home /> },
        { path: 'phim/:id', element:<MovieDetailUser/>  },
        { path: 'search', element:<SearchPage/>  },
        { path: 'about', element: <GioiThieu /> },
        { path: 'news', element: <NewsUser /> },
        { path: 'news/:id', element: <NewsDetail /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'auth/google/callback', element: <GoogleCallback /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: '/tim-kiem-phim', element: <TimKiemPhim /> },


      ],
    },
    {
      path: '/admin',
      element: <Admin />,
      children: [
        { path: '', element: <DashboardAdmin /> },
        { path: 'movies/list', element: <List /> },
         { path: 'movies/detail/:id', element: <MovieDetail /> },
        { path: 'movies/add', element: <AddMoviesPage /> },
        { path: 'category_chair/list', element: <ListCategoryChair /> },
        { path: 'movies/trash', element: <TrashMovies /> },

        { path: 'chair/list', element: <Chair /> },
        { path: 'lichchieu/list', element: <LichChieu /> },
        { path: 'lichchieucu/list', element: <LichChieuCu /> },
        { path: 'lichchieu/add', element: <AddLichChieu /> },
        { path: 'lichchieu/edit/:id', element: <EditLichChieu /> },
        { path: 'cinemas/list', element: <ListCinemas /> },
        { path: 'cinemas/add', element: <AddCinemasPage /> },
        { path: 'room/list', element: <ListPhongChieu /> },
        { path: 'room/list/chuaxuat', element: <PhongChieuChuaXuat /> },
        { path: 'room/trashed/list', element: <PhongChieuXoaMem /> },
        { path: 'room/add', element: <AddPhongChieu /> },

        { path: 'comment/phanhoinguoidung', element: <PhanHoiNguoiDung /> },
        { path: 'comment/list', element: <Comment /> },



        { path: 'users', element: <UserList/> },
        { path: 'vaitro', element: <VaiTro/> },

        { path: 'genre', element: <GenresManager/> },
        
        { path: 'food', element: <FoodList /> },
        { path: 'food/add', element: <FoodAdd /> },
        { path: 'food/edit/:id', element: <FoodEdit /> },
        { path: 'vouchers/list', element: <VouchersList /> },
        { path: 'vouchers/add', element: <AddVoucher /> },
        { path: 'news', element: <ListNews /> },
        { path: 'news/add', element: <AddNews /> },
        { path: 'danh-gia/list', element: <ListDanhGia /> },
      ],
    },
  ]);

  return <>{element}</>;
};

export default Routermain;