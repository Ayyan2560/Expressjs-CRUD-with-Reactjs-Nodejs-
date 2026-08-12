import { SearchIcon, BellIcon, MenuIcon } from './Icons'

const Topbar = ({ title, onMenuClick, searchValue, onSearchChange }) => {
  return (
    <header className="topbar">
      <button className="mobile-menu-btn" onClick={onMenuClick} aria-label="Open menu">
        <MenuIcon />
      </button>

      <div className="topbar-title">{title}</div>

      <div className="topbar-search">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search posts..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="topbar-actions">
        <button className="icon-btn" aria-label="Notifications">
          <BellIcon />
          <span className="notification-dot" />
        </button>
        <div className="user-avatar" style={{ width: 36, height: 36, fontSize: 13 }}>
          A
        </div>
      </div>
    </header>
  )
}

export default Topbar