
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export async function health() {
  const r = await fetch(`${BASE}/api/health`)
  return r.json()
}

export async function searchCocktails(q = '', limit = 50) {
  const url = new URL(`${BASE}/api/cocktails`)
  if (q) url.searchParams.set('q', q)
  url.searchParams.set('limit', String(limit))
  const r = await fetch(url)
  return r.json()
}

export async function recommend({ have = [], taste = [], abvMin = 0, abvMax = 30, k = 6 }) {
  const url = new URL(`${BASE}/api/recommend`)
  if (have.length) url.searchParams.set('have', have.join(','))
  if (taste.length) url.searchParams.set('taste', taste.join(','))
  url.searchParams.set('abv_min', String(abvMin))
  url.searchParams.set('abv_max', String(abvMax))
  url.searchParams.set('k', String(k))
  const r = await fetch(url)
  return r.json()
}

export async function generate(base = 'rum', vibe = 'refreshing') {
  const url = new URL(`${BASE}/api/generate`)
  url.searchParams.set('base', base)
  url.searchParams.set('vibe', vibe)
  const r = await fetch(url)
  return r.json()
}
