'use client'
// app/admin/configuracoes/page.tsx
import { useEffect, useState } from 'react'
import { getSiteConfig, updateSiteConfig } from '@/lib/config'
import { SiteConfig } from '@/types'
import { Save, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminConfigPage() {
  const [config, setConfig] = useState<SiteConfig>({
    whatsappNumber: '',
    storeName: '',
    welcomeMessage: '',
    instagramUrl: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getSiteConfig().then(cfg => {
      setConfig(cfg)
      setLoading(false)
    })
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateSiteConfig(config)
      toast.success('Configurações salvas!')
    } catch {
      toast.error('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-nude-300 border-t-nude-700 rounded-full animate-spin" />
    </div>
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light text-nude-900">Configurações</h1>
        <p className="font-body text-sm text-nude-500 mt-1">Dados do site e contato</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-xl">
        <div className="bg-white p-6 md:p-8 space-y-5">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-nude-400">
            Informações gerais
          </p>

          <div>
            <label className="label-admin">Nome da Loja</label>
            <input
              type="text"
              value={config.storeName}
              onChange={e => setConfig(c => ({ ...c, storeName: e.target.value }))}
              className="input-admin"
              placeholder="Brasil Premium"
            />
          </div>

          <div>
            <label className="label-admin">Número WhatsApp *</label>
            <input
              type="text"
              value={config.whatsappNumber}
              onChange={e => setConfig(c => ({ ...c, whatsappNumber: e.target.value }))}
              className="input-admin"
              placeholder="351912345678 (com código do país, sem + ou espaços)"
            />
            <p className="font-body text-xs text-nude-400 mt-1">
              Exemplo: 351912345678 (Portugal) ou 32470123456 (Bélgica)
            </p>
          </div>

          <div>
            <label className="label-admin">Mensagem de boas-vindas no WhatsApp</label>
            <textarea
              value={config.welcomeMessage}
              onChange={e => setConfig(c => ({ ...c, welcomeMessage: e.target.value }))}
              className="input-admin resize-none"
              rows={3}
              placeholder="Olá! Gostaria de solicitar um orçamento:"
            />
            <p className="font-body text-xs text-nude-400 mt-1">
              Esta mensagem aparece no início do pedido enviado pelo WhatsApp
            </p>
          </div>

          <div>
            <label className="label-admin">Instagram (opcional)</label>
            <input
              type="url"
              value={config.instagramUrl || ''}
              onChange={e => setConfig(c => ({ ...c, instagramUrl: e.target.value }))}
              className="input-admin"
              placeholder="https://instagram.com/suapagina"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </form>
    </div>
  )
}
