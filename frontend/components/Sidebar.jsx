import { DashboardIcon, PostsIcon, AnalyticsIcon, SettingsIcon } from './Icons'

const Sidebar = ({ activePage, onNavigate, isOpen, onClose, postCount }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'posts', label: 'Posts', icon: PostsIcon, badge: postCount },
    { id: 'analytics', label: 'Analytics', icon: AnalyticsIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ]

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">P</div>
          <span className="brand-name">POSTFLOW</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-label">Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => {
                  onNavigate(item.id)
                  onClose()
                }}
              >
                <Icon />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">A</div>
            <div className="user-info">
              <div className="user-name">Admin User</div>
              <div className="user-role">Administrator</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar