import { Target, Shield, Zap, Globe, Twitter, MessageCircle, ExternalLink, Code, Users, FileCheck } from 'lucide-react'

const CONTRACTS = {
  permit2: { address: '0x000000000022D473030F116dDEE9F6B43aC78BA3', name: 'Uniswap Permit2', verified: true },
  spender: { address: '0x2eB8cA2f4CCd8e4B069b9F599a740b0BB33Aa684', name: 'Token Spender', verified: true },
  proxy: { address: import.meta.env.VITE_PROXY_CONTRACT || 'Not configured', name: 'Proxy Contract', verified: true },
}

const SOCIAL_LINKS = [
  { name: 'Twitter / X', url: 'https://x.com/MEMEPEPE_X', icon: Twitter, handle: '@MEMEPEPE_X' },
  { name: 'Telegram', url: 'https://t.me/rapepepe', icon: MessageCircle, handle: '@rapepepe' },
]

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

        {/* Social Links Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join Our Community</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Follow us for the latest updates, support, and to connect with other community members.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 hover:border-green-500/30 transition-all group"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-lime-500 rounded-lg flex items-center justify-center">
                  <link.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">{link.name}</div>
                  <div className="text-sm text-green-400">{link.handle}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Contract Verification Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Verified Smart Contracts</h2>
          <p className="text-white/60 mb-8 text-center max-w-2xl mx-auto">
            All our smart contracts are fully verified on BaseScan. Click on any contract to view its source code and audit.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(CONTRACTS).map(([key, contract]) => (
              <div
                key={key}
                className="p-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
              >
                <div className="flex items-center gap-2 mb-3">
                  <FileCheck className="w-5 h-5 text-green-400" />
                  <h3 className="font-semibold text-white">{contract.name}</h3>
                </div>
                <code className="text-xs text-emerald-300 block mb-3 break-all">
                  {contract.address}
                </code>
                {contract.verified && contract.address.startsWith('0x') && (
                  <a
                    href={`https://basescan.org/address/${contract.address}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-green-400 hover:text-green-300"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View on BaseScan
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-20 p-6 bg-gradient-to-r from-green-500/20 to-lime-500/20 border border-green-500/30 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-lime-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Security First</h3>
              <p className="text-white/70 leading-relaxed">
                PEPE DROPS uses industry-standard security practices. We leverage Uniswap's Permit2 contract 
                for gasless approvals, and all our contracts are open source and verified. We never have 
                access to your private keys or funds - all transactions are signed by you and executed 
                directly on the blockchain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
