import React from 'react'
import { useRoutes } from 'react-router-dom'
import User from '../Layouts/UserLayout/User'
import ListCinema from '../pages/Cinema/List'
import Dashboard from '../pages/Dashboard'

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
          path:"cinemas/list",
          element:<ListCinema/>
        },
      ]
    }
  ])
  return (
    <div>{element}</div>
  )
}

export default Routermain