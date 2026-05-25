// lib/whatsapp.ts
import { CartItem, SiteConfig } from '@/types'

export function generateWhatsAppMessage(
  items: CartItem[],
  config: SiteConfig
): string {
  const header = config.welcomeMessage || 'Olá! Gostaria de solicitar um orçamento:'
  const lines = items.map(item => {
    const subtotal = (item.product.price * item.quantity).toFixed(2)
    return `• *${item.product.name}*\n  Quantidade: ${item.quantity}\n  Valor: €${subtotal}${item.product.sku ? `\n  Cód: ${item.product.sku}` : ''}`
  })
  const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  return `${header}\n\n${lines.join('\n\n')}\n\n*Total: €${total.toFixed(2)}*`
}

export function openWhatsApp(phoneNumber: string, message: string): void {
  const number = phoneNumber.replace(/\D/g, '')
  const encoded = encodeURIComponent(message)
  window.open(`https://wa.me/${number}?text=${encoded}`, '_blank')
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}
