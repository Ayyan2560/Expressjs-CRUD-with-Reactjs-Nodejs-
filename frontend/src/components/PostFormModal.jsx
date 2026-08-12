import { useState } from 'react'
import Modal from './Modal'

const PostFormModal = ({ mode, initialData, onClose, onSubmit, isSubmitting }) => {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}

    if (!title.trim()) {
      newErrors.title = 'Title is required'
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required'
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({ title: title.trim(), description: description.trim() })
    }
  }

  const isEdit = mode === 'edit'

  return (
    <Modal
      title={isEdit ? 'Edit Post' : 'Create New Post'}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button
            className={`btn btn-primary ${isSubmitting ? 'btn-loading' : ''}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isEdit ? 'Save Changes' : 'Create Post'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            Title <span>*</span>
          </label>
          <input
            type="text"
            className={`form-input ${errors.title ? 'error' : ''}`}
            placeholder="Enter post title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (errors.title) setErrors({ ...errors, title: undefined })
            }}
            disabled={isSubmitting}
          />
          {errors.title && <div className="form-error">{errors.title}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Description <span>*</span>
          </label>
          <textarea
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            placeholder="Enter post description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              if (errors.description) setErrors({ ...errors, description: undefined })
            }}
            disabled={isSubmitting}
          />
          {errors.description && <div className="form-error">{errors.description}</div>}
        </div>
      </form>
    </Modal>
  )
}

export default PostFormModal