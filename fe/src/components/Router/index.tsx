
import { useRoutes } from 'react-router-dom'
import Admin from '../Layouts/AdminLayout/Admin'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import User from '../Layouts/UserLayout/User'
import { List } from 'antd'
import ListCategoryChair from '../pages/Admin/CategoryChairPage/ListCategoryChair'
import Dashboard from '../pages/Admin/DashboardAdmin'
import AddMoviesPage from '../pages/Admin/MoviesPage/AddMoviesPage'
import DashboardUser from '../pages/User/DashboardUser'
import ListCinemas from '../pages/CinemasPage/ListCinemas'
import AddCinemasPage from '../pages/CinemasPage/AddCinemaForm'

const Routermain = () => {
  const element = useRoutes([
    {
      path:"/",
      element:<User/>,
      children:[
        {
          path:"/",
          element:<DashboardUser/>
        }
      ]
    },
    {
      path:"admin",
      element:<Admin/>,
      children:[
        {
          path:"admin",
          element:<Dashboard/>
        },
        {
          path:"movies/list",
          element:<List/>
        },
        {
          path:"movies/add",
          element:<AddMoviesPage/>
        },
        {
          path:"category_chair/list",
          element:<ListCategoryChair/>
        },
        {
          path:"cinemas/list",
          element:<ListCinemas/>
        },
        {
          path:"cinemas/add",
          element:<AddCinemasPage/>
        }
      ]
    },
  ])
  return (
    <div>{element}</div>
  )
}

export default Routermain