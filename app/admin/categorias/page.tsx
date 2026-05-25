'use client'
// app/admin/categorias/page.tsx
import { useEffect, useState } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/categories'
import { Category } from '@/types'
import { Plus, Edit2, Trash2, Check, X, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)

  const load = async () => {
    const cats = await getCategories(false)
    setCategories(cats)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const slugify = (name: string) =>
    name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const handleAdd = async () => {
    if (!newName.trim()) return
    try {
      await createCategory({
        name: newName.trim(),
        slug: slugify(newName.trim()),
        order: categories.length + 1,
        visible: true,
      })
      toast.success('Categoria criada!')
      setNewName('')
      setAdding(false)
      load()
    } catch {
      toast.error('Erro ao criar categoria')
    }
  }

  const handleEdit = async (id: string) => {
    if (!editName.trim()) return
    await updateCategory(id, { name: editName.trim(), slug: slugify(editName.trim()) })
    toast.success('Categoria atualizada!')
    setEditing(null)
    load()
  }

  const handleToggleVisible = async (cat: Category) => {
    await updateCategory(cat.id, { visible: !cat.visible })
    toast.success(cat.visible ? 'Categoria ocultada' : 'Categoria visível')
    load()
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir a categoria "${name}"? Os produtos desta categoria não serão excluídos.`)) return
    await deleteCategory(id)
    toast.success('Categoria excluída')
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light text-nude-900">Categorias</h1>
          <p className="font-body text-sm text-nude-500 mt-1">{categories.length} categoria(s)</p>
        </div>
        <button onClick={() => setAdding(true)} className="btn-primary flex items-center gap-2">
          <Plus size={15} /> Nova Categoria
        </button>
      </div>

      <div className="bg-white">
        {/* Formulário nova categoria */}
        {adding && (
          <div className="p-4 border-b border-nude-100 bg-nude-50 flex items-center gap-3">
            <input
              autoFocus
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false) }}
              className="input-admin flex-1 max-w-xs"
              placeholder="Nome da categoria..."
            />
            <button onClick={handleAdd} className="p-2 text-green-600 hover:text-green-700">
              <Check size={18} />
            </button>
            <button onClick={() => { setAdding(false); setNewName('') }} className="p-2 text-nude-400 hover:text-nude-600">
              <X size={18} />
            </button>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-nude-300 border-t-nude-700 rounded-full animate-spin mx-auto" />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-display text-xl text-nude-400">Nenhuma categoria ainda</p>
          </div>
        ) : (
          <ul>
            {categories.map((cat, i) => (
              <li key={cat.id} className={`flex items-center gap-4 p-4 ${i < categories.length - 1 ? 'border-b border-nude-50' : ''}`}>
                <span className="font-body text-xs text-nude-300 w-6">{cat.order}</span>

                {editing === cat.id ? (
                  <input
                    autoFocus
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleEdit(cat.id); if (e.key === 'Escape') setEditing(null) }}
                    className="input-admin flex-1 max-w-xs"
                  />
                ) : (
                  <div className="flex-1">
                    <p className="font-body text-sm font-medium text-nude-800">{cat.name}</p>
                    <p className="font-body text-xs text-nude-400">/{cat.slug}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  {editing === cat.id ? (
                    <>
                      <button onClick={() => handleEdit(cat.id)} className="p-2 text-green-600 hover:text-green-700"><Check size={15} /></button>
                      <button onClick={() => setEditing(null)} className="p-2 text-nude-400 hover:text-nude-600"><X size={15} /></button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleToggleVisible(cat)}
                        className={`p-2 rounded transition-colors ${cat.visible ? 'text-green-500 hover:text-green-700' : 'text-nude-300 hover:text-nude-500'}`}
                        title={cat.visible ? 'Ocultar' : 'Exibir'}
                      >
                        {cat.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <button onClick={() => { setEditing(cat.id); setEditName(cat.name) }} className="p-2 text-nude-400 hover:text-nude-700 transition-colors"><Edit2 size={15} /></button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} className="p-2 text-nude-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
