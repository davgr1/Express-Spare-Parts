import { FiEdit2, FiTrash2 } from 'react-icons/fi'

function getStockLevel(stock) {
  if (stock === 0) return 'empty'
  if (stock <= 5) return 'low'
  if (stock <= 20) return 'medium'
  return 'high'
}

function getStockBars(stock) {
  const level = getStockLevel(stock)
  let filledCount = 0
  if (stock === 0) filledCount = 0
  else if (stock <= 5) filledCount = 1
  else if (stock <= 20) filledCount = 2
  else filledCount = 3

  return Array.from({ length: 3 }, (_, i) => (
    <div
      key={i}
      className={`stock-bar ${i < filledCount ? `filled ${level}` : ''}`}
    />
  ))
}

function ListadoProductos({ products, onEdit, onDelete }) {
  return (
    <table className="data-table" id="products-table">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Descripción Técnica</th>
          <th>Precio</th>
          <th>Nivel de Stock</th>
          <th>Proveedor</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {!products || products.length === 0 ? (
          <tr>
            <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
              No hay productos registrados
            </td>
          </tr>
        ) : products.map((product) => {
          const level = getStockLevel(product.stock || 0)
          return (
            <tr key={product._id}>
              <td>
                <div className="product-cell">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-thumb"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div className="product-thumb" style={{
                    display: product.image ? 'none' : 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', color: '#9CA3AF'
                  }}>
                    📦
                  </div>
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <span className="sku">SKU: {product._id?.slice(-6).toUpperCase()}</span>
                  </div>
                </div>
              </td>
              <td>{product.description ? product.description.substring(0, 40) + (product.description.length > 40 ? '...' : '') : '—'}</td>
              <td>${Number(product.price || 0).toFixed(2)}</td>
              <td>
                <div className="stock-badge">
                  <span className={`stock-count ${level}`}>
                    {product.stock || 0}
                    <br />
                    <small style={{ fontSize: '9px', fontWeight: 500 }}>UNIDADES</small>
                  </span>
                  <div className="stock-bars">
                    {getStockBars(product.stock || 0)}
                  </div>
                </div>
              </td>
              <td>
                {product.supplider_id
                  ? (typeof product.supplider_id === 'object'
                      ? product.supplider_id.name || '—'
                      : product.supplider_id.toString().slice(-6).toUpperCase())
                  : '—'}
              </td>
              <td>
                <div className="actions-cell">
                  <button
                    className="btn-action edit"
                    onClick={() => onEdit(product)}
                    title="Editar"
                    id={`edit-product-${product._id}`}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="btn-action delete"
                    onClick={() => onDelete(product._id)}
                    title="Eliminar"
                    id={`delete-product-${product._id}`}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default ListadoProductos
