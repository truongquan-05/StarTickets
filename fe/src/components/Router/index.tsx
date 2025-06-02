import React from 'react'
import { useRoutes } from 'react-router-dom'
import User from '../Layouts/UserLayout/User'
import List from '../pages/Product/List'
import Dashboard from '../pages/Dashboard'
import Edit from '../pages/Product/Edit'
import Add from '../pages/Product/Add'

import UserList from '../pages/User/List'
import UserEdit from '../pages/User/Edit'
import UserAdd from '../pages/User/Add'
import GenresManager from '../GenresManager'

const Routermain = () => {
  const element = useRoutes([
    {
      path:"",
      element:<User/>,
      children:[
        {
          path:"",
          element:<Dashboard/>
        },
        {
          path:"movies/list",
          element:<List/>
        },
        {
          path:"movies/edit/:id",
          element:<Edit/>
        },
        {
          path:"movies/add",
          element:<Add/>
        },


        

        {
        path:"/users",
        element:<UserList/>
        },
        {
        path:"/users/add",
        element:<UserAdd/>
        },
        {
        path:"/users/edit/:id",
        element:<UserEdit/>
        },
        {
          path:"movies/genre",
          element:<GenresManager/>
        }
      ]
    }
  ])
  return (
    <div>{element}</div>
  )
}

export default Routermain