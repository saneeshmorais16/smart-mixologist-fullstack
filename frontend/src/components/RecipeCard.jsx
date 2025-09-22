
export default function RecipeCard({ item }) {
  return (
    <div className="glass p-4 hover:scale-[1.01] transition">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        {typeof item.score === 'number' && (
          <span className="text-xs px-2 py-1 rounded bg-white/10 border border-white/10">
            Score {item.score.toFixed(2)}
          </span>
        )}
      </div>
      <div className="mt-2 text-sm opacity-90">
        <div><span className="opacity-70">Ingredients:</span> {item.ingredients}</div>
        <div><span className="opacity-70">Taste:</span> {item.taste_tags}</div>
        <div><span className="opacity-70">ABV:</span> {item.abv}%</div>
      </div>
      <div className="mt-3 text-sm">
        <span className="opacity-70">Method:</span> {item.instructions}
      </div>
    </div>
  )
}
