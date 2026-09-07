import { useState, useEffect, useRef } from 'react'

function FormMarketing({ onClose, onSave, promocionEdit }) {
  const [titulo, setTitulo] = useState(promocionEdit ? promocionEdit.titulo : '')
  const [descripcion, setDescripcion] = useState(promocionEdit ? promocionEdit.descripcion : '')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(promocionEdit?.imagen || '')
  const [errorMsg, setErrorMsg] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (promocionEdit) {
      setTitulo(promocionEdit.titulo || '')
      setDescripcion(promocionEdit.descripcion || '')
      setImagePreview(promocionEdit.imagen || '')
    }
  }, [promocionEdit])

  const handleImageClick = () => {
    fileInputRef.current.click()
  }

  const handleImageFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    // Preview local
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')
    
    if (!titulo.trim()) {
      setErrorMsg('El título es requerido.')
      return
    }
    if (!descripcion.trim()) {
      setErrorMsg('La descripción es requerida.')
      return
    }
    if (!promocionEdit && !image) {
      setErrorMsg('La imagen es requerida para una nueva promoción.')
      return
    }

    onSave({ titulo, descripcion, image })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-product" onClick={e => e.stopPropagation()}>

        <div className="modal-product-header">
          <h2>{promocionEdit ? 'Editar Promoción' : 'Nueva Promoción'}</h2>
        </div>

        {errorMsg && (
          <div className="modal-error">{errorMsg}</div>
        )}

        <form id="promo-form" onSubmit={handleSubmit} noValidate className="modal-product-form">
          {/* Columna izquierda */}
          <div className="modal-product-fields">
            <div className="form-group">
              <label htmlFor="promo-titulo">Título <span style={{ color: '#f87171' }}>*</span></label>
              <input
                id="promo-titulo"
                type="text"
                placeholder="Ej: Compra 1 y llévate otro..."
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="promo-desc">Descripción <span style={{ color: '#f87171' }}>*</span></label>
              <textarea
                id="promo-desc"
                placeholder="Descripción de la promoción..."
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                rows={5}
                required
              />
            </div>
            {promocionEdit && promocionEdit.imagen && !image && (
              <small style={{ color: 'rgba(255,255,255,0.5)', display: 'block', marginTop: '4px' }}>
                Imagen actual cargada. Selecciona otra para cambiarla.
              </small>
            )}
          </div>

          {/* Columna derecha: selector de imagen */}
          <div className="modal-product-preview">
            <p className="preview-label">Imagen {!promocionEdit && <span style={{ color: '#f87171' }}>*</span>}</p>
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
                    <span>Cambiar</span>
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
            />

            {imagePreview && (
              <button
                type="button"
                className="btn-remove-image"
                onClick={(e) => { e.stopPropagation(); setImagePreview(''); setImage(null) }}
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
          <button type="submit" className="btn-modal-save" form="promo-form">
            {promocionEdit ? 'Actualizar' : 'Guardar Promoción'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default FormMarketing
