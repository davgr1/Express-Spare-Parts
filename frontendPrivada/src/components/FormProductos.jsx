import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const API = 'http://localhost:4000/api'

function FormProductos({ product, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    price: '',
    stock: '',
    supplider_id: '',
    description: ''
  })
  const [errorMsg, setErrorMsg] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const fileInputRef = useRef(null)

  // Panel de proveedores
  const [showSuppliers, setShowSuppliers] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [suppliersLoading, setSuppliersLoading] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)

  useEffect(() => {
    if (product) {
      // supplider_id puede venir como objeto {_id, name} por el populate
      const suppId = product.supplider_id
      const suppIdStr = suppId
        ? (typeof suppId === 'object' ? suppId._id : suppId)
        : ''

      setFormData({
        name: product.name || '',
        image: product.image || '',
        price: product.price || '',
        stock: product.stock || '',
        supplider_id: suppIdStr,
        description: product.description || ''
      })
      setImagePreview(product.image || '')

      // Pre-llenar proveedor seleccionado si viene el objeto
      if (suppId && typeof suppId === 'object' && suppId.name) {
        setSelectedSupplier({ _id: suppId._id, name: suppId.name, email: suppId.email })
      }
    }
  }, [product])

  const fetchSuppliers = async () => {
    setSuppliersLoading(true)
    try {
      const res = await axios.get(`${API}/supplider`)
      const active = res.data.filter(s => s.status === true)
      setSuppliers(active)
    } catch (err) {
      console.error('Error cargando proveedores:', err)
    } finally {
      setSuppliersLoading(false)
    }
  }

  const handleOpenSuppliers = () => {
    if (!showSuppliers) fetchSuppliers()
    setShowSuppliers(prev => !prev)
  }

  const handleSelectSupplier = (supplier) => {
    setSelectedSupplier(supplier)
    setFormData(prev => ({ ...prev, supplider_id: supplier._id }))
    setShowSuppliers(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
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

          // Escalar manteniendo proporción
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

    if (formData.name.trim().length < 3) {
      setErrorMsg('El nombre del producto debe tener al menos 3 caracteres.')
      return
    }
    if (Number(formData.price) <= 0) {
      setErrorMsg('El precio debe ser un número mayor a 0.')
      return
    }
    if (Number(formData.stock) < 0 || !Number.isInteger(Number(formData.stock))) {
      setErrorMsg('El stock debe ser un número entero válido (0 o más).')
      return
    }
    if (!formData.supplider_id) {
      setErrorMsg('Debes seleccionar un proveedor.')
      return
    }

    onSave(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-product" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-product-header">
          <h2>{product ? 'Editar Producto' : 'Registro de producto'}</h2>
        </div>

        {errorMsg && (
          <div className="modal-error">{errorMsg}</div>
        )}

        <form id="product-form" onSubmit={handleSubmit} noValidate className="modal-product-form">

          {/* Columna izquierda */}
          <div className="modal-product-fields">

            <div className="form-group">
              <label htmlFor="name">Nombre del producto</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej. Cilindro de Freno"
                required
              />
            </div>

            <div className="form-row-two">
              <div className="form-group">
                <label htmlFor="price">Precio</label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="stock">Stock</label>
                <input
                  id="stock"
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Selector de proveedor */}
            <div className="form-group supplier-field-group">
              <label>Proveedor</label>
              <button
                type="button"
                className="supplier-select-btn"
                onClick={handleOpenSuppliers}
              >
                {selectedSupplier ? (
                  <span className="supplier-selected-name">
                    <span className="supplier-dot active" />
                    {selectedSupplier.name}
                  </span>
                ) : formData.supplider_id ? (
                  <span className="supplier-selected-name">
                    <span className="supplier-dot active" />
                    ID: {formData.supplider_id.toString().slice(-6).toUpperCase()}
                  </span>
                ) : (
                  <span className="supplier-placeholder">Seleccionar proveedor</span>
                )}
              </button>

              {/* Panel deslizante */}
              <div className={`supplier-panel ${showSuppliers ? 'open' : ''}`}>
                <div className="supplier-panel-header">
                  <span>Proveedores activos</span>
                  <button
                    type="button"
                    className="supplier-panel-close"
                    onClick={() => setShowSuppliers(false)}
                  >✕</button>
                </div>
                <div className="supplier-panel-list">
                  {suppliersLoading ? (
                    <div className="supplier-loading">Cargando...</div>
                  ) : suppliers.length === 0 ? (
                    <div className="supplier-empty">No hay proveedores activos</div>
                  ) : suppliers.map(s => (
                    <div
                      key={s._id}
                      className={`supplier-item ${formData.supplider_id === s._id ? 'selected' : ''}`}
                      onClick={() => handleSelectSupplier(s)}
                    >
                      {s.image ? (
                        <img src={s.image} alt={s.name} className="supplier-avatar" />
                      ) : (
                        <div className="supplier-avatar-placeholder">
                          {s.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="supplier-item-info">
                        <p className="supplier-item-name">{s.name}</p>
                        <p className="supplier-item-email">{s.email || '—'}</p>
                      </div>
                      <span className="supplier-dot active" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descripción técnica del producto"
                rows="4"
              />
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
                    <span> Cambiar</span>
                  </div>
                </>
              ) : (
                <div className="image-preview-placeholder">
                  <span className="image-preview-icon"></span>
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

        {/* Acciones */}
        <div className="modal-product-actions">
          <button type="button" className="btn-modal-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-modal-save" form="product-form">
            {product ? 'Actualizar' : 'Agregar'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default FormProductos
