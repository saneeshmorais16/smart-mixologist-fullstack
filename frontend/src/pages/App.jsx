
import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import RecipeCard from '../components/RecipeCard.jsx'
import Filters from '../components/Filters.jsx'
import Footer from '../components/Footer.jsx'
import { health, searchCocktails, recommend, generate } from '../api.js'

export default function App() {
  const [status, setStatus] = useState(null)
  const [list, setList] = useState([])
  const [recs, setRecs] = useState([])
  const [query, setQuery] = useState('')
  const [special, setSpecial] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      const h = await health()
      setStatus(h)
      const items = await searchCocktails('', 200)
      setList(items)
    })()
  }, [])

  const allIngredients = useMemo(() => {
    const s = new Set()
    list.forEach(i => i.ingredients.split(',').map(x => s.add(x.trim().toLowerCase())))
    return Array.from(s).sort()
  }, [list])

  const allTastes = useMemo(() => {
    const s = new Set()
    list.forEach(i => i.taste_tags.split(',').map(x => s.add(x.trim().toLowerCase())))
    return Array.from(s).sort()
  }, [list])

  const onFilter = async ({ have, taste, abv }) => {
    setLoading(true)
    const data = await recommend({ have, taste, abvMin: abv[0], abvMax: abv[1], k: 8 })
    setRecs(data)
    setLoading(false)
  }

  const onReset = () => {
    setRecs([])
    setQuery('')
  }

  const filtered = useMemo(() => {
    if (!query) return list
    const q = query.toLowerCase()
    return list.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.ingredients.toLowerCase().includes(q) ||
      i.taste_tags.toLowerCase().includes(q)
    )
  }, [list, query])

  const makeSpecial = async (base, vibe) => {
    setSpecial(null)
    const res = await generate(base, vibe)
    setSpecial(res)
  }

  return (
    <div>
      <Navbar />
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,70,239,0.25),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.18),transparent_40%)]"></div>
        <div className="max-w-6xl mx-auto px-4 py-16 relative">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Mix smarter. <span className="text-fuchsia-400">Serve better.</span>
          </h1>
          <p className="mt-4 text-slate-300 max-w-2xl">
            Your AI bartender that recommends, teaches, and invents cocktails — all tuned by Saneesh.
          </p>
          <div className="mt-6 flex gap-2">
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by name, taste, ingredient..."
                   className="flex-1 glass px-4 py-3 outline-none" />
          </div>
          {status && (
            <div className="mt-3 text-xs opacity-70">Dataset: {status.items} cocktails • API online</div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        <section className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-1">
            <Filters allIngredients={allIngredients} allTastes={allTastes} onFilter={onFilter} onReset={onReset} />
            <div className="glass p-4 mt-6">
              <div className="font-semibold">✨ Saneesh Special</div>
              <div className="mt-2 text-sm opacity-90">Generate a custom cocktail.</div>
              <div className="mt-3 flex gap-2">
                <select id="base" className="flex-1 bg-transparent border border-white/10 rounded p-2">
                  <option className="bg-slate-900">rum</option>
                  <option className="bg-slate-900">vodka</option>
                  <option className="bg-slate-900">gin</option>
                  <option className="bg-slate-900">tequila</option>
                  <option className="bg-slate-900">whiskey</option>
                  <option className="bg-slate-900">no alcohol</option>
                </select>
                <select id="vibe" className="flex-1 bg-transparent border border-white/10 rounded p-2">
                  <option className="bg-slate-900">refreshing</option>
                  <option className="bg-slate-900">tropical</option>
                  <option className="bg-slate-900">bitter</option>
                  <option className="bg-slate-900">dessert</option>
                  <option className="bg-slate-900">coffee</option>
                  <option className="bg-slate-900">aromatic</option>
                </select>
              </div>
              <button onClick={() => makeSpecial(
                document.getElementById('base').value,
                document.getElementById('vibe').value
              )} className="mt-3 px-3 py-2 rounded bg-fuchsia-500/90 hover:bg-fuchsia-500 text-slate-900 font-semibold">
                Generate
              </button>
              {special && (
                <div className="mt-4 text-sm">
                  <div className="font-semibold">{special.name}</div>
                  <div className="opacity-90">Ingredients: {special.ingredients}</div>
                  <div className="opacity-90">Method: {special.instructions}</div>
                </div>
              )}
            </div>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recommendations</h2>
              {loading && <div className="text-xs opacity-70">Loading…</div>}
            </div>
            {recs.length ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {recs.map((item, idx) => <RecipeCard key={idx} item={item} />)}
              </div>
            ) : (
              <div className="opacity-70 text-sm">Use filters on the left to get tailored picks.</div>
            )}

            <h2 className="text-xl font-semibold mt-8">All Cocktails</h2>
            <div className="grid sm:grid-cols-2 gap-4 mt-2">
              {filtered.map((item, idx) => <RecipeCard key={idx} item={item} />)}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
