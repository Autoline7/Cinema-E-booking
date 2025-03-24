import React from 'react'

const Header = ({loading, userData}) => {
  return (
      <div>
        <h1 className="admin__header">Admin Page</h1>
        {loading ? "Loading...." : <h1 className="admin__welcome">Welcome back, {userData ? userData.firstName : "Guest"}</h1>}
      </div>
  )
}

export default Header
