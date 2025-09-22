
import { useState } from 'react'

export default function Filters({ allIngredients, allTastes, onFilter, onReset }) {
  const [have, setHave] = useState([])
  const [taste, setTaste] = useState([])
  const [abv, setAbv] = useState([0, 25])

  const submit = (e) => {
    e.preventDefault()
    onFilter({ have, taste, abv })
  }

  return (
    <form onSubmit={submit} className="glass p-4 space-y-3">
      <div className="font-semibold">Filters</div>
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm opacity-80">Ingredients you have</label>
          <select multiple className="w-full bg-transparent border border-white/10 rounded p-2 h-28"
            onChange={(e) => setHave(Array.from(e.target.selectedOptions).map(o => o.value))}>
            {allIngredients.map(x => <option key={x} value={x} className="bg-slate-900">{x}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm opacity-80">Taste tags</label>
          <select multiple className="w-full bg-transparent border border-white/10 rounded p-2 h-28"
            onChange={(e) => setTaste(Array.from(e.target.selectedOptions).map(o => o.value))}>
            {allTastes.map(x => <option key={x} value={x} className="bg-slate-900">{x}</option>)}
          </select>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <label className="text-sm opacity-80">ABV</label>
        <input type="number" className="w-20 bg-transparent border border-white/10 rounded p-2"
               value={abv[0]} onChange={(e)=>setAbv([+e.target.value, abv[1]])} />
        <span className="opacity-70">to</span>
        <input type="number" className="w-20 bg-transparent border border-white/10 rounded p-2"
               value={abv[1]} onChange={(e)=>setAbv([abv[0], +e.target.value])} />
        <span className="opacity-70">%</span>
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-2 rounded bg-fuchsia-500/90 hover:bg-fuchsia-500 text-slate-900 font-semibold">Apply</button>
        <button type="button" onClick={onReset} className="px-3 py-2 rounded border border-white/10">Reset</button>
      </div>
    </form>
  )
}
