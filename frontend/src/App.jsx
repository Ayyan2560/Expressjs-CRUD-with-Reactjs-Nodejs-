import { useState, useEffect, useCallback, useRef } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Toast from './components/Toast'
import PostFormModal from './components/PostFormModal'
import ViewPostModal from './components/ViewPostModal'
import DeleteConfirmModal from './components/DeleteConfirmModal'
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from './services/api'
import {
  PlusIcon,
  RefreshIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  FileIcon,
  ActivityIcon,
  ClockIcon,
  ErrorIcon,
} from './components/Icons'

function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [viewingPost, setViewingPost] = useState(null)
  const [deletingPost, setDeletingPost] = useState(null)

  // Submit states
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Toast states
  const [toasts, setToasts] = useState([])
  const toastIdRef = useRef(0)

  const showToast = useCallback((type, title, message) => {
    const id = ++toastIdRef.current
    setToasts((prev) => [...prev, { id, type, title, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const closeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const fetchPosts = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      try {
        const response = await getAllPosts()
        const data = response.data?.data || []
        setPosts(data)
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || 'Failed to load posts. Please try again.'
        setError(errorMessage)
        showToast('error', 'Error', errorMessage)
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [showToast]
  )

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleCreatePost = async (postData) => {
    setIsCreating(true)
    try {
      await createPost(postData)
      showToast('success', 'Post Created', 'Your post was created successfully.')
      setShowCreateModal(false)
      await fetchPosts()
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Failed to create post. Please try again.'
      showToast('error', 'Creation Failed', errorMessage)
    } finally {
      setIsCreating(false)
    }
  }

  const handleEditPost = async (postData) => {
    if (!editingPost) return
    setIsUpdating(true)
    try {
      await updatePost(editingPost.id, postData)
      showToast('success', 'Post Updated', 'Your post was updated successfully.')
      setShowEditModal(false)
      setEditingPost(null)
      await fetchPosts()
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Failed to update post. Please try again.'
      showToast('error', 'Update Failed', errorMessage)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleViewPost = async (post) => {
    setViewingPost(post)
    setShowViewModal(true)

    try {
      const response = await getPostById(post.id)
      const data = response.data?.data
      if (data) {
        setViewingPost(data)
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Failed to load post details.'
      showToast('error', 'Error', errorMessage)
      setShowViewModal(false)
    }
  }

  const handleDeletePost = async () => {
    if (!deletingPost) return
    setIsDeleting(true)
    try {
      await deletePost(deletingPost.id)
      showToast('success', 'Post Deleted', 'The post was deleted successfully.')
      setShowDeleteModal(false)
      setDeletingPost(null)
      await fetchPosts()
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Failed to delete post. Please try again.'
      showToast('error', 'Delete Failed', errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  const openEditModal = (post) => {
    setEditingPost(post)
    setShowEditModal(true)
  }

  const openDeleteModal = (post) => {
    setDeletingPost(post)
    setShowDeleteModal(true)
  }

  const filteredPosts = posts.filter((post) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      post.title?.toLowerCase().includes(query) ||
      post.description?.toLowerCase().includes(query) ||
      String(post.id).includes(query)
    )
  })

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard':
        return 'Dashboard'
      case 'posts':
        return 'Posts'
      case 'analytics':
        return 'Analytics'
      case 'settings':
        return 'Settings'
      default:
        return 'Dashboard'
    }
  }

  const renderSkeletonRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <div className="skeleton-row" key={index}>
        <div className="skeleton skeleton-avatar" />
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-line medium" />
        <div className="skeleton skeleton-line small" />
        <div className="skeleton-actions">
          <div className="skeleton skeleton-btn" />
          <div className="skeleton skeleton-btn" />
          <div className="skeleton skeleton-btn" />
        </div>
      </div>
    ))
  }

  const renderEmptyState = () => (
    <div className="state-container">
      <div className="state-icon empty">
        <FileIcon />
      </div>
      <h3 className="state-title">No posts yet</h3>
      <p className="state-message">
        Get started by creating your first post. It will appear here once created.
      </p>
      <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
        <PlusIcon />
        Create Post
      </button>
    </div>
  )

  const renderErrorState = () => (
    <div className="state-container">
      <div className="state-icon error">
        <ErrorIcon />
      </div>
      <h3 className="state-title">Something went wrong</h3>
      <p className="state-message">{error}</p>
      <button className="btn btn-secondary" onClick={() => fetchPosts()}>
        <RefreshIcon />
        Try Again
      </button>
    </div>
  )

  const renderPostsTable = () => (
    <div className="table-card">
      <div className="table-header">
        <div>
          <div className="table-header-title">All Posts</div>
          <div className="table-header-subtitle">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
          </div>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => fetchPosts(true)}
            disabled={refreshing}
          >
            <RefreshIcon />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
            <PlusIcon />
            Create Post
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="post-table">
          <thead>
            <tr>
              <th>Post</th>
              <th>Description</th>
              <th>ID</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post.id}>
                <td>
                  <div className="post-title-cell">
                    <div className="post-avatar">
                      {post.title?.charAt(0)?.toUpperCase() || 'P'}
                    </div>
                    <div className="post-title">{post.title}</div>
                  </div>
                </td>
                <td>
                  <div className="post-description">{post.description}</div>
                </td>
                <td>
                  <span className="post-id">{post.id}</span>
                </td>
                <td>
                  <div className="actions-cell">
                    <button
                      className="action-btn view"
                      onClick={() => handleViewPost(post)}
                      title="View post"
                    >
                      <EyeIcon />
                    </button>
                    <button
                      className="action-btn edit"
                      onClick={() => openEditModal(post)}
                      title="Edit post"
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => openDeleteModal(post)}
                      title="Delete post"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="mobile-cards">
        {filteredPosts.map((post) => (
          <div className="mobile-post-card" key={post.id}>
            <div className="mobile-post-card-header">
              <div className="mobile-post-title">{post.title}</div>
              <span className="post-id">{post.id}</span>
            </div>
            <div className="mobile-post-description">{post.description}</div>
            <div className="mobile-post-footer">
              <div className="mobile-post-actions">
                <button
                  className="action-btn view"
                  onClick={() => handleViewPost(post)}
                  title="View post"
                >
                  <EyeIcon />
                </button>
                <button
                  className="action-btn edit"
                  onClick={() => openEditModal(post)}
                  title="Edit post"
                >
                  <EditIcon />
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => openDeleteModal(post)}
                  title="Delete post"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderDashboard = () => (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your content management</p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-secondary"
            onClick={() => fetchPosts(true)}
            disabled={refreshing}
          >
            <RefreshIcon />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <PlusIcon />
            Create Post
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon">
              <FileIcon />
            </div>
          </div>
          <div className="stat-card-value">{posts.length}</div>
          <div className="stat-card-label">Total Posts</div>
          <div className="stat-card-trend neutral">All published content</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon purple">
              <ActivityIcon />
            </div>
          </div>
          <div className="stat-card-value">{posts.length > 0 ? 'Active' : '—'}</div>
          <div className="stat-card-label">Content Status</div>
          <div className="stat-card-trend positive">All systems operational</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon green">
              <ClockIcon />
            </div>
          </div>
          <div className="stat-card-value">{posts.length > 0 ? 'Live' : '—'}</div>
          <div className="stat-card-label">Latest Activity</div>
          <div className="stat-card-trend neutral">Real-time updates</div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div>
            <div className="table-header-title">Recent Posts</div>
            <div className="table-header-subtitle">
              Your latest {Math.min(posts.length, 5)} posts
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setActivePage('posts')}>
            View All
          </button>
        </div>

        {loading ? (
          renderSkeletonRows()
        ) : error ? (
          renderErrorState()
        ) : posts.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="table-wrapper">
            <table className="post-table">
              <thead>
                <tr>
                  <th>Post</th>
                  <th>Description</th>
                  <th>ID</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.slice(0, 5).map((post) => (
                  <tr key={post.id}>
                    <td>
                      <div className="post-title-cell">
                        <div className="post-avatar">
                          {post.title?.charAt(0)?.toUpperCase() || 'P'}
                        </div>
                        <div className="post-title">{post.title}</div>
                      </div>
                    </td>
                    <td>
                      <div className="post-description">{post.description}</div>
                    </td>
                    <td>
                      <span className="post-id">{post.id}</span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="action-btn view"
                          onClick={() => handleViewPost(post)}
                          title="View post"
                        >
                          <EyeIcon />
                        </button>
                        <button
                          className="action-btn edit"
                          onClick={() => openEditModal(post)}
                          title="Edit post"
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => openDeleteModal(post)}
                          title="Delete post"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )

  const renderPostsPage = () => (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Posts</h1>
          <p className="page-subtitle">Manage and organize your content</p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-secondary"
            onClick={() => fetchPosts(true)}
            disabled={refreshing}
          >
            <RefreshIcon />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <PlusIcon />
            Create Post
          </button>
        </div>
      </div>

      {loading ? (
        <div className="table-card">
          <div className="table-header">
            <div>
              <div className="table-header-title">All Posts</div>
              <div className="table-header-subtitle">Loading posts...</div>
            </div>
          </div>
          {renderSkeletonRows()}
        </div>
      ) : error ? (
        <div className="table-card">{renderErrorState()}</div>
      ) : posts.length === 0 ? (
        <div className="table-card">{renderEmptyState()}</div>
      ) : (
        renderPostsTable()
      )}
    </div>
  )

  const renderPlaceholderPage = () => (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">{getPageTitle()}</h1>
          <p className="page-subtitle">This section is coming soon</p>
        </div>
      </div>
      <div className="table-card">
        <div className="state-container">
          <div className="state-icon empty">
            <FileIcon />
          </div>
          <h3 className="state-title">{getPageTitle()} is under construction</h3>
          <p className="state-message">
            This feature is currently in development. Check back soon for updates.
          </p>
        </div>
      </div>
    </div>
  )

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return renderDashboard()
      case 'posts':
        return renderPostsPage()
      case 'analytics':
      case 'settings':
        return renderPlaceholderPage()
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        postCount={posts.length}
      />

      <main className="main-content">
        <Topbar
          title={getPageTitle()}
          onMenuClick={() => setSidebarOpen(true)}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
        {renderPage()}
      </main>

      {/* Modals */}
      {showCreateModal && (
        <PostFormModal
          mode="create"
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePost}
          isSubmitting={isCreating}
        />
      )}

      {showEditModal && editingPost && (
        <PostFormModal
          mode="edit"
          initialData={editingPost}
          onClose={() => {
            setShowEditModal(false)
            setEditingPost(null)
          }}
          onSubmit={handleEditPost}
          isSubmitting={isUpdating}
        />
      )}

      {showViewModal && viewingPost && (
        <ViewPostModal
          post={viewingPost}
          onClose={() => {
            setShowViewModal(false)
            setViewingPost(null)
          }}
        />
      )}

      {showDeleteModal && deletingPost && (
        <DeleteConfirmModal
          post={deletingPost}
          onClose={() => {
            setShowDeleteModal(false)
            setDeletingPost(null)
          }}
          onConfirm={handleDeletePost}
          isDeleting={isDeleting}
        />
      )}

      {/* Toasts */}
      <Toast toasts={toasts} onClose={closeToast} />
    </div>
  )
}

export default App