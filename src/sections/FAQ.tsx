import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

const faqs = [
  {
    question: 'What is a drop?',
    answer: 'A drop is a distribution of cryptocurrency tokens or coins to wallet addresses, usually for free. Projects use drops to reward early adopters, promote new tokens, or build community engagement.'
  },
  {
    question: 'How do I claim tokens?',
    answer: 'Connect your wallet, select the token you want to claim, and click the claim button. Make sure you are on the Base network and have enough ETH for gas fees. The claim simulation shows you the estimated value before confirming.'
  },
  {
    question: 'Is this site safe to use?',
    answer: 'This site provides informational data only. Always verify smart contract addresses on BaseScan before interacting with them. Never share your private keys or seed phrases. Connect only with wallets you trust.'
  },
  {
    question: 'Where does the price data come from?',
    answer: 'Token prices are fetched from CoinGecko API in real-time. On-chain data like total supply and balances are read directly from the Base blockchain using public RPC nodes.'
  },
  {
    question: 'What is the relayer?',
    answer: 'The relayer is a backend service that can execute transactions on your behalf using Permit2 signatures. This allows for gasless or sponsored transactions in some cases. The relayer only works with pre-approved Permit2 allowances.'
  },
  {
    question: 'Why do I need to switch to Base network?',
    answer: 'All tokens listed are on the Base network (Chain ID 8453). You must be connected to Base to see your real balances and interact with the contracts. Use the network switch button in your wallet or our UI.'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="min-h-screen px-4 py-20 bg-gradient-to-br from-green-950 via-emerald-950 to-teal-950">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-lime-500 mb-6 shadow-lg shadow-green-500/20">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-black mb-4 text-white">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-green-300 via-lime-300 to-emerald-300 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-white/60">
            Everything you need to know about PEPE DROP
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-white/10 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/10 transition-all"
              >
                <span className="font-semibold pr-4 text-white">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform text-green-400 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5">
                  <p className="text-white/60 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
