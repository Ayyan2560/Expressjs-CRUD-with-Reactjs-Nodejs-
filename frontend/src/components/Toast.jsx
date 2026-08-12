import { CheckIcon, ErrorIcon, InfoIcon, CloseIcon } from './Icons'

const Toast = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckIcon />
      case 'error':
        return <ErrorIcon />
      default:
        return <InfoIcon />
    }
  }

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          <div className={`toast-icon ${toast.type}`}>{getIcon(toast.type)}</div>
          <div className="toast-content">
            <div className="toast-title">{toast.title}</div>
            {toast.message && <div className="toast-message">{toast.message}</div>}
          </div>
          <button className="toast-close" onClick={() => onClose(toast.id)} aria-label="Close notification">
            <CloseIcon />
          </button>
        </div>
      ))}
    </div>
  )
}

export default Toast