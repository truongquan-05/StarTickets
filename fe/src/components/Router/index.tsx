import { useRoutes } from 'react-router-dom'
import Admin from '../Layouts/AdminLayout/Admin'
import User from '../Layouts/UserLayout/User'
import ListCategoryChair from '../pages/Admin/CategoryChairPage/ListCategoryChair'

import AddMoviesPage from '../pages/Admin/MoviesPage/AddMoviesPage'
import DashboardUser from '../pages/User/DashboardUser'
import List from '../pages/Admin/MoviesPage/List'
import DashboardAdmin from '../pages/Admin/DashboardAdmin'

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
          path:"",
          element:<DashboardAdmin/>
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
      ]
    },
  ])
  return (
    <div>{element}</div>
  )
}

export default Routermain