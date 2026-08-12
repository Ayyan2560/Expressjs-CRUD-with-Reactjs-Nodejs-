import Modal from './Modal'

const ViewPostModal = ({ post, onClose }) => {
  if (!post) return null

  return (
    <Modal title="Post Details" onClose={onClose}>
      <div className="detail-item">
        <div className="detail-label">Title</div>
        <div className="detail-value">{post.title}</div>
      </div>

      <div className="detail-item">
        <div className="detail-label">Description</div>
        <div className="detail-value">{post.description}</div>
      </div>

      <div className="detail-item">
        <div className="detail-label">Post ID</div>
        <div className="detail-value mono">{post.id}</div>
      </div>
    </Modal>
  )
}

export default ViewPostModal