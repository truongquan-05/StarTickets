import React from 'react'
import { useRoutes } from 'react-router-dom'
import User from '../Layouts/UserLayout/User'
import List from '../pages/Product/List'
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
          path:"movies/list",
          element:<List/>
        }
      ]
    }
  ])
  return (
    <div>{element}</div>
  )
}

export default Routermain