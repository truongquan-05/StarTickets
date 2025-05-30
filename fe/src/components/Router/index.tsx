import React from 'react'
import { useRoutes } from 'react-router-dom'
import User from '../Layouts/AdminLayout/Admin'
import List from '../pages/MoviesPage/List'
import Dashboard from '../pages/Dashboard'
import AddMoviesPage from '../pages/MoviesPage/AddMoviesPage'
import ListCategoryChair from '../pages/CategoryChairPage/ListCategoryChair'
import ListCinemas from '../pages/CinemasPage/ListCinemas'

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
        {
          path:"category_chair/list",
          element:<ListCategoryChair/>
        },
        {
          path:"cinemas/list",
          element:<ListCinemas/>
        },
      ]
    }
  ])
  return (
    <div>{element}</div>
  )
}

export default Routermain