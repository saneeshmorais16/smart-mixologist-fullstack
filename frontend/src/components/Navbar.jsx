
export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="font-bold tracking-wide text-lg">
          <span className="text-fuchsia-400">Smart</span> Mixologist
          <span className="opacity-60 text-sm ml-2">Powered by Saneesh</span>
        </div>
        <div className="text-sm opacity-80">🍸 Crafted with AI</div>
      </div>
    </nav>
  )
}
