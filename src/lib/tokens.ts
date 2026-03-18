export type TokenConfig = {
  symbol: string
  name: string
  address: `0x${string}`
  decimals: number
  coingeckoId?: string
}

// ZORA-created tokens for airdrop
// Replace these placeholders with your actual ZORA token addresses
export const ZORA_TOKENS: TokenConfig[] = [
  {
    symbol: 'ZORACOIN1',
    name: 'Zora Coin One',
    address: '0x1111111111111111111111111111111111111111',
    decimals: 18,
  },
  {
    symbol: 'ZORACOIN2',
    name: 'Zora Coin Two',
    address: '0x2222222222222222222222222222222222222222',
    decimals: 18,
  },
  {
    symbol: 'ZORACOIN3',
    name: 'Zora Coin Three',
    address: '0x3333333333333333333333333333333333333333',
    decimals: 18,
  },
]

export const TOKENS: readonly TokenConfig[] = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    decimals: 6,
    coingeckoId: 'usd-coin',
  },
  {
    symbol: 'DAI',
    name: 'Dai',
    address: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb',
    decimals: 18,
    coingeckoId: 'dai',
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
    coingeckoId: 'weth',
  },
  {
    symbol: 'cbETH',
    name: 'Coinbase Wrapped Staked ETH',
    address: '0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22',
    decimals: 18,
    coingeckoId: 'coinbase-wrapped-staked-eth',
  },
  {
    symbol: 'BRETT',
    name: 'Brett',
    address: '0x532f27101965dd16442e59d40670faf5ebb142e4',
    decimals: 18,
    coingeckoId: 'based-brett',
  },
  {
    symbol: 'AERO',
    name: 'Aerodrome Finance',
    address: '0x940181a94a35a4569e4529a3cdfb74e38fd98631',
    decimals: 18,
    coingeckoId: 'aerodrome-finance',
  },
  {
    symbol: 'DEGEN',
    name: 'Degen',
    address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
    decimals: 18,
    coingeckoId: 'degen-base',
  },
  {
    symbol: 'ZORA',
    name: 'Zora',
    address: '0x1111111111166b7fe7bd91427724b487980afc69',
    decimals: 18,
    coingeckoId: 'zora',
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    address: '0x88fb150bdc53a65fe94dea0c9ba0a6daf8c6e196',
    decimals: 18,
    coingeckoId: 'chainlink',
  },
  {
    symbol: 'DOT',
    name: 'Polkadot',
    address: '0x8d010bf9c26881788b4e6bf5fd1bdc358c8f90b8',
    decimals: 18,
    coingeckoId: 'polkadot',
  },
  {
    symbol: 'MORPHO',
    name: 'Morpho',
    address: '0xbaa5cc21fd487b8fcc2f632f3f4e8d37262a0842',
    decimals: 18,
    coingeckoId: 'morpho',
  },
  {
    symbol: 'ZRO',
    name: 'LayerZero',
    address: '0x6985884c4392d348587b19cb9eaaf157f13271cd',
    decimals: 18,
    coingeckoId: 'layerzero',
  },
  {
    symbol: 'VIRTUAL',
    name: 'Virtual Protocol',
    address: '0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b',
    decimals: 18,
    coingeckoId: 'virtual-protocol',
  },
  {
    symbol: 'CAKE',
    name: 'PancakeSwap',
    address: '0x3055913c90fcc1a6ce9a358911721eeb942013a1',
    decimals: 18,
    coingeckoId: 'pancakeswap-token',
  },
  {
    symbol: 'CRV',
    name: 'Curve DAO Token',
    address: '0x8ee73c484a26e0a5df2ee2a4960b789967dd0415',
    decimals: 18,
    coingeckoId: 'curve-dao-token',
  },
  {
    symbol: 'SPX',
    name: 'SPX6900',
    address: '0x50da645f148798f68ef2d7db7c1cb22a6819bb2c',
    decimals: 8,
    coingeckoId: 'spx6900',
  },
  {
    symbol: 'SYRUP',
    name: 'Syrup',
    address: '0x688aee022aa544f150678b8e5720b6b96a9e9a2f',
    decimals: 18,
    coingeckoId: 'syrup',
  },
  {
    symbol: 'RIVER',
    name: 'River',
    address: '0xda7ad9dea9397cffddae2f8a052b82f1484252b3',
    decimals: 18,
    coingeckoId: 'river',
  },
  {
    symbol: 'TRAC',
    name: 'OriginTrail',
    address: '0xa81a52b4dda010896cdd386c7fbdc5cdc835ba23',
    decimals: 18,
    coingeckoId: 'origintrail',
  },
  {
    symbol: 'COW',
    name: 'CoW Protocol',
    address: '0xc694a91e6b071bf030a18bd3053a7fe09b6dae69',
    decimals: 18,
    coingeckoId: 'cow-protocol',
  },
  {
    symbol: 'W',
    name: 'Wormhole',
    address: '0xb0ffa8000886e57f86dd5264b9582b2ad87b2b91',
    decimals: 18,
    coingeckoId: 'wormhole',
  },
  {
    symbol: 'HOME',
    name: 'DeFi App',
    address: '0x4bfaa776991e85e5f8b1255461cbbd216cfc714f',
    decimals: 18,
    coingeckoId: 'defi-app',
  },
  {
    symbol: 'AWE',
    name: 'AWE',
    address: '0x1b4617734c43f6159f3a70b7e06d883647512778',
    decimals: 18,
    coingeckoId: 'aweawe',
  },
] as const
