import { useState, useEffect } from 'react'
import axios from 'axios'
import { FiSearch } from 'react-icons/fi'
import Boton from '../components/Boton'
import ListadoProveedores from '../components/ListadoProveedores'
import FormProveedores from '../components/FormProveedores'

const API = 'http://localhost:4000/api'

function Proveedores() {
  const [proveedores, setProveedores] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editProv, setEditProv] = useState(null)

  const fetchProveedores = async () => {
    try {
      const res = await axios.get(`${API}/supplider`)
      setProveedores(res.data)
      setFiltered(res.data)
    } catch (err) {
      console.error('Error fetching providers:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProveedores()
  }, [])

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(proveedores)
    } else {
      const term = search.toLowerCase()
      setFiltered(proveedores.filter(p =>
        p.name?.toLowerCase().includes(term) ||
        p.email?.toLowerCase().includes(term) ||
        p.direcion?.toLowerCase().includes(term)
      ))
    }
  }, [search, proveedores])

  const handleSave = async (data) => {
    try {
      if (editProv) {
        await axios.put(`${API}/supplider/${editProv._id}`, data)
      } else {
        await axios.post(`${API}/supplider`, data)
      }
      setShowForm(false)
      setEditProv(null)
      fetchProveedores()
    } catch (err) {
      console.error('Error saving provider:', err)
      alert('Error al guardar el proveedor')
    }
  }

  const handleEdit = (prov) => {
    setEditProv(prov)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este proveedor?')) return
    try {
      await axios.delete(`${API}/supplider/${id}`)
      fetchProveedores()
    } catch (err) {
      console.error('Error deleting provider:', err)
      alert('Error al eliminar el proveedor')
    }
  }

  const handleOpenForm = () => {
    setEditProv(null)
    setShowForm(true)
  }

  if (loading) {
    return <div className="loading-container">Cargando proveedores...</div>
  }

  return (
    <>
      <div className="toolbar">
        <Boton texto="Agregar" onClick={handleOpenForm} />
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar proveedor"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="search-providers"
          />
          <FiSearch className="search-icon" />
        </div>
      </div>

      <ListadoProveedores
        proveedores={filtered}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <FormProveedores
          proveedor={editProv}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditProv(null) }}
        />
      )}
    </>
  )
}

export default Proveedores
