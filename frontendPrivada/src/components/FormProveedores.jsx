import { useState, useEffect, useRef } from 'react'

function FormProveedores({ proveedor, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    direcion: '',
    status: true,
    image: ''
  })
  const [errorMsg, setErrorMsg] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (proveedor) {
      setFormData({
        name: proveedor.name || '',
        email: proveedor.email || '',
        phone: proveedor.phone || '',
        direcion: proveedor.direcion || '',
        status: proveedor.status !== undefined ? proveedor.status : true,
        image: proveedor.image || ''
      })
      setImagePreview(proveedor.image || '')
    }
  }, [proveedor])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleImageClick = () => {
    fileInputRef.current.click()
  }

  const compressImage = (file, maxSize = 300, quality = 0.75) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let { width, height } = img

          if (width > height) {
            if (width > maxSize) { height = Math.round(height * maxSize / width); width = maxSize }
          } else {
            if (height > maxSize) { width = Math.round(width * maxSize / height); height = maxSize }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', quality))
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    })
  }

  const handleImageFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const compressed = await compressImage(file)
    setImagePreview(compressed)
    setFormData((prev) => ({ ...prev, image: compressed }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      setErrorMsg('El nombre debe tener al menos 3 caracteres.')
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMsg('El correo no tiene un formato válido.')
      return
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      setErrorMsg('El teléfono debe tener al menos 8 caracteres.')
      return
    }

    if (!formData.direcion.trim() || formData.direcion.trim().length < 5) {
      setErrorMsg('La dirección debe tener al menos 5 caracteres.')
      return
    }

    onSave(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-product" onClick={(e) => e.stopPropagation()}>

        <div className="modal-product-header">
          <h2>{proveedor ? 'Editar Proveedor' : 'Registro de proveedor'}</h2>
        </div>

        {errorMsg && (
          <div className="modal-error">{errorMsg}</div>
        )}

        <form id="provider-form" onSubmit={handleSubmit} noValidate className="modal-product-form">
          {/* Columna izquierda */}
          <div className="modal-product-fields">
            <div className="form-group">
              <label htmlFor="name">Nombre de la empresa</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre de la empresa"
                required
              />
            </div>

            <div className="form-row-two">
              <div className="form-group">
                <label htmlFor="email">Correo</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Teléfono</label>
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0000-0000"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="direcion">Dirección</label>
              <textarea
                id="direcion"
                name="direcion"
                value={formData.direcion}
                onChange={handleChange}
                placeholder="Dirección del proveedor"
                rows="4"
                required
              />
            </div>

            <div className="form-group" style={{ marginTop: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'none', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px' }}
                />
                Proveedor Activo
              </label>
            </div>
          </div>

          {/* Columna derecha: selector de imagen */}
          <div className="modal-product-preview">
            <p className="preview-label">Imagen</p>
            <div
              className={`image-preview-box clickable ${imagePreview ? 'has-image' : ''}`}
              onClick={handleImageClick}
              title="Clic para seleccionar imagen"
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Vista previa"
                    className="image-preview-img"
                    onError={() => setImagePreview('')}
                  />
                  <div className="image-preview-overlay">
                    <span>📷 Cambiar</span>
                  </div>
                </>
              ) : (
                <div className="image-preview-placeholder">
                  <span className="image-preview-icon">📷</span>
                  <p>Seleccionar imagen</p>
                  <small>Clic para subir</small>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageFile}
              id="file-image-input"
            />

            {imagePreview && (
              <button
                type="button"
                className="btn-remove-image"
                onClick={(e) => { e.stopPropagation(); setImagePreview(''); setFormData(p => ({ ...p, image: '' })) }}
              >
                ✕ Quitar imagen
              </button>
            )}
          </div>
        </form>

        <div className="modal-product-actions">
          <button type="button" className="btn-modal-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-modal-save" form="provider-form">
            {proveedor ? 'Actualizar' : 'Agregar'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default FormProveedores
