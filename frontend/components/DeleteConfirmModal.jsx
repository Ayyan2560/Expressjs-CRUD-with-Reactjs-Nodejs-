import Modal from './Modal'
import { AlertIcon } from './Icons'

const DeleteConfirmModal = ({ post, onClose, onConfirm, isDeleting }) => {
  if (!post) return null

  return (
    <Modal
      title="Delete Post"
      onClose={onClose}
      maxWidth="440px"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </button>
          <button
            className={`btn btn-danger ${isDeleting ? 'btn-loading' : ''}`}
            onClick={onConfirm}
            disabled={isDeleting}
          >
            Delete
          </button>
        </>
      }
    >
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <div
          className="state-icon"
          style={{
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            margin: '0 auto 20px',
          }}
        >
          <AlertIcon />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
          Delete "{post.title}"?
        </h3>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          This action cannot be undone. The post will be permanently removed from your
          content.
        </p>
      </div>
    </Modal>
  )
}

export default DeleteConfirmModal