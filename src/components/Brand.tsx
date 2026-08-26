import { Link } from 'react-router-dom'

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className={`brand ${compact ? 'brand--compact' : ''}`} to="/" aria-label="5 na 5 – domov">
      <span className="brand__five">5</span>
      <span className="brand__connector">na</span>
      <span className="brand__five">5</span>
    </Link>
  )
}
