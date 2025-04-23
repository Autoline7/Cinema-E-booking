const Sidebar = ({logout}) => {
  return (
    <div className="sidebar">
        <h2 className="sidebar__logo">LOGO</h2>
        <i onClick={logout} className="material-symbols-outlined sidebar__logout">logout</i>
    </div>
  )
}

export default Sidebar
