// src/Router/index.tsx
import { useRoutes } from 'react-router-dom';
import Admin from '../Layouts/AdminLayout/Admin';
import User from '../Layouts/UserLayout/User';
import ListCategoryChair from '../pages/Admin/CategoryChairPage/ListCategoryChair';
import AddMoviesPage from '../pages/Admin/MoviesPage/AddMoviesPage';
import DashboardUser from '../pages/User/DashboardUser';
import List from '../pages/Admin/MoviesPage/List';
import DashboardAdmin from '../pages/Admin/DashboardAdmin';
import ListCinemas from '../pages/CinemasPage/ListCinemas';
import AddCinemasPage from '../pages/CinemasPage/AddCinemaForm';
import FoodList from '../pages/Food/List';
import FoodAdd from '../pages/Food/Add';
import FoodEdit from '../pages/Food/Edit';
import UserList from '../pages/User/List';
import UserEdit from '../pages/User/Edit';
import UserAdd from '../pages/User/Add';
import GenresManager from '../GenresManager';




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
        { path: 'cinemas/list', element: <ListCinemas /> },
        { path: 'cinemas/add', element: <AddCinemasPage /> },


        { path: 'users', element: <UserList/> },
        { path: 'users/add', element: <UserAdd/> },
        { path: 'users/edit/:id', element: <UserEdit/> },

        { path: 'genre', element: <GenresManager/> },
        
        { path: 'food', element: <FoodList /> },
        { path: 'food/add', element: <FoodAdd /> },
        { path: 'food/edit/:id', element: <FoodEdit /> },

      ],
    },
  ]);

  return <>{element}</>;
};

export default Routermain;
