import React from 'react'
import { useRoutes } from 'react-router-dom'
import User from '../Layouts/UserLayout/User'
import List from '../pages/Product/List'
import Dashboard from '../pages/Dashboard'
import Edit from '../pages/Product/Edit'
import Add from '../pages/Product/Add'
import GenreAdd from '../pages/Genre/Add'
import GenreList from '../pages/Genre/List'
import GenreEdit from '../pages/Genre/Edit'

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
        path:"movies/genres",
        element:<GenreList/>
        },
        {
        path:"movies/genres/add",
        element:<GenreAdd/>
        },
        {
        path:"movies/genres/edit/:id",
        element:<GenreEdit/>
        }
      ]
    }
  ])
  return (
    <div>{element}</div>
  )
}

export default Routermain