import React, { useContext } from 'react'
import { UserContext } from './UserContext'

const Routes = () => {
    const {username, id} = useContext(UserContext)
  
  if (username) return <p>Logged in!</p>
    return (
    <div>
      
    </div>
  )
}

export default Routes
