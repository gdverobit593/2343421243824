import { Wallet, CheckCircle, Gift, Clock } from 'lucide-react'

export default function HowTo() {
  const steps = [
    {
      icon: Wallet,
      step: 1,
      title: 'Connect Your Wallet',
      description: 'Click the "Connect Wallet" button in the top right corner. Choose your preferred wallet (MetaMask, Rainbow, Coinbase Wallet, etc.) and approve the connection.',
      tips: ['Make sure you\'re on Base Network', 'Have some ETH for gas (we\'ll reimburse!)'],
    },
    {
      icon: CheckCircle,
      step: 2,
      title: 'Check Eligibility',
      description: 'Our system automatically checks if your wallet is eligible for the drop. Eligibility is based on various factors including wallet age, activity, and engagement.',
      tips: ['Most active wallets are eligible', 'New wallets may need to wait'],
    },
    {
      icon: Gift,
      step: 3,
      title: 'Select & Claim',
      description: 'Choose which token you want to claim from the available options. Each wallet can claim one token type per drop period.',
      tips: ['Compare token values', 'Consider future potential'],
    },
    {
      icon: Clock,
      step: 4,
      title: 'Receive Tokens',
      description: 'After claiming, tokens will be sent to your wallet within a few minutes. You can view them in your wallet or on BaseScan.',
      tips: ['Add token contract to wallet if not visible', 'Check transaction on BaseScan'],
    },
  ]

  return (
    <div className="min-h-screen px-4 py-20 bg-gradient-to-br from-green-950 via-emerald-950 to-teal-950">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-6 text-white">
            How to{' '}
            <span className="bg-gradient-to-r from-green-300 via-lime-300 to-emerald-300 bg-clip-text text-transparent">
              Claim
            </span>
          </h1>
          <p className="text-xl text-white/60">
            Follow these simple steps to claim your meme tokens
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((item, index) => (
            <div
              key={index}
              className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-green-500/30 transition-all"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-lime-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-3xl font-bold text-white/80">{item.step}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-white">{item.title}</h3>
                  <p className="text-white/60 mb-4 leading-relaxed">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tips.map((tip, tipIndex) => (
                      <span
                        key={tipIndex}
                        className="text-sm text-green-300 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/30"
                      >
                        {tip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Important Notice */}
        <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm border border-green-500/30 rounded-2xl">
          <h3 className="text-xl font-bold mb-3 text-green-400">Important Notice</h3>
          <ul className="space-y-2 text-white/60">
            <li>• Each wallet can only claim once per drop period</li>
            <li>• Make sure you have enough ETH for gas fees (we reimburse up to $5)</li>
            <li>• Claims are processed on a first-come, first-served basis</li>
            <li>• Drop ends when supply runs out</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
