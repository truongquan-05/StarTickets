import React from 'react'
import { useRoutes } from 'react-router-dom'
import User from '../Layouts/AdminLayout/Admin'
import List from '../pages/MoviesPage/List'
import Dashboard from '../pages/Dashboard'
import AddMoviesPage from '../pages/MoviesPage/AddMoviesPage'

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
          path:"movies/add",
          element:<AddMoviesPage/>
        },
      ]
    }
  ])
  return (
    <div>{element}</div>
  )
}

export default Routermain