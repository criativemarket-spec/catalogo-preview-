// app/produto/[id]/page.tsx
import ProdutoClient from './ProdutoClient'

export const dynamic = 'force-dynamic'

interface Props {
  params: { id: string }
}

export default function ProdutoPage({ params }: Props) {
  return <ProdutoClient id={params.id} />
}
