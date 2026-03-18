import { Target, Shield, Zap, Globe } from 'lucide-react'

export default function About() {
  const features = [
    {
      icon: Target,
      title: 'Fair Distribution',
      description: 'Every eligible participant receives equal opportunity to claim tokens based on transparent criteria.',
    },
    {
      icon: Shield,
      title: 'Secure & Verified',
      description: 'All smart contracts are audited and verified on Base Network for maximum security.',
    },
    {
      icon: Zap,
      title: 'Zero Gas Fees',
      description: 'We sponsor all transaction fees, making the claiming process completely free for you.',
    },
    {
      icon: Globe,
      title: 'Base Network',
      description: 'Built on Base for fast, cheap, and reliable transactions with Ethereum security.',
    },
  ]

  return (
    <div className="min-h-screen px-4 py-20 bg-gradient-to-br from-green-950 via-emerald-950 to-teal-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-black mb-6 text-white">
            About{' '}
            <span className="bg-gradient-to-r from-green-300 via-lime-300 to-emerald-300 bg-clip-text text-transparent">
              PEPE DROP
            </span>
          </h1>
          <p className="text-xl text-white/60 max-w-3xl mx-auto">
            The ultimate meme token distribution platform on Base Network. 
            Fair, transparent, and ribbitingly fast.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-green-500/30 transition-all group"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-lime-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/20">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-white/60">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="bg-gradient-to-r from-green-500 to-lime-500 rounded-3xl p-1">
            <div className="bg-black/80 backdrop-blur-xl rounded-3xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-white">Our Mission</h2>
              <p className="text-white/70 leading-relaxed mb-6">
                PEPE DROP was created with a simple mission: make meme token distribution fair, 
                transparent, and accessible to everyone in the crypto community. We believe 
                that great meme projects deserve widespread adoption.
              </p>
              <p className="text-white/70 leading-relaxed">
                By leveraging Base Network's low-cost, high-speed infrastructure, we can 
                distribute tokens efficiently while maintaining the security standards of Ethereum.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white mb-6">Key Statistics</h2>
            {[
              { label: 'Total Users', value: '27,500+', change: '+12%' },
              { label: 'Tokens Distributed', value: '1.2M+', change: '8 types' },
              { label: 'Success Rate', value: '99.9%', change: 'Perfect' },
              { label: 'Claim Time', value: '<30s', change: 'Instant' },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 hover:border-green-500/30 transition-all"
              >
                <div>
                  <div className="text-sm text-white/50">{stat.label}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                </div>
                <div className="text-sm text-green-400 font-medium px-3 py-1 bg-green-500/10 rounded-full">{stat.change}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
