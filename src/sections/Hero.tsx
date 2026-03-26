import { ArrowRight, Rocket, Shield } from 'lucide-react'

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-950 via-emerald-950 to-teal-950">
      {/* Background gradient - Pepe green theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/40 via-emerald-500/40 to-teal-400/40" />
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-lime-500/20 rounded-full blur-[100px] animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[150px]" />
      </div>

      {/* Pepe mascot - top right */}
      <div className="absolute top-10 right-5 w-32 h-32 md:w-48 md:h-48 z-20">
        <img 
          src="https://i.postimg.cc/TwgPQCrG/photo-2026-03-17-13-54-07.jpg" 
          alt="Pepe mascot" 
          className="w-full h-full object-contain drop-shadow-2xl animate-bounce rounded-full border-4 border-green-400/50"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>

      {/* Pepe hero - bottom left */}
      <div className="absolute bottom-10 left-5 w-40 h-40 md:w-64 md:h-64 z-20">
        <img 
          src="https://i.postimg.cc/cHwJTXQW/photo-2026-03-17-23-49-59.jpg" 
          alt="Pepe hero" 
          className="w-full h-full object-contain drop-shadow-2xl rounded-full border-4 border-green-400/50"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-green-400/30 mb-8">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-300 font-semibold text-sm tracking-wide uppercase">Official Pepe Distributor</span>
        </div>

        {/* Main title */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-4 tracking-tighter">
          <span className="bg-gradient-to-r from-green-300 via-lime-300 to-emerald-300 bg-clip-text text-transparent">
            PEPE DROP
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
          The ultimate meme coin drop platform on <span className="text-green-400 font-semibold">Base Network</span>. 
          Claim exclusive tokens and join the ribbiting community.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#tokens"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-lime-500 rounded-xl font-bold text-black shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_50px_rgba(34,197,94,0.6)] hover:scale-105 transition-all"
          >
            <Rocket className="w-5 h-5" />
            Start Claiming
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#about"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            <Shield className="w-5 h-5" />
            Learn More
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[
            { label: 'Verified', value: '100%' },
            { label: 'Network', value: 'Base' },
            { label: 'Speed', value: '<30s' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-white/50">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-white/40 text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-5 h-8 border border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-green-400 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  )
}
