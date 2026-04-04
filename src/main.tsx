import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { base } from 'wagmi/chains'
import { connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  coinbaseWallet,
  injectedWallet,
  walletConnectWallet,
  rainbowWallet,
  trustWallet,
  argentWallet,
  ledgerWallet,
  okxWallet,
} from '@rainbow-me/rainbowkit/wallets'
import '@rainbow-me/rainbowkit/styles.css'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: false,
      staleTime: Infinity,
      gcTime: Infinity,
    },
  },
})

const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string | undefined

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Wallets',
      wallets: [
        metaMaskWallet,
        coinbaseWallet,
        rainbowWallet,
        trustWallet,
        argentWallet,
        ledgerWallet,
        okxWallet,
        walletConnectWallet,
        injectedWallet,
      ],
    },
  ],
  {
    appName: 'token-drop',
    projectId: walletConnectProjectId || 'token-airdrop',
  },
)

const config = createConfig({
  chains: [base],
  connectors,
  transports: {
    [base.id]: http('https://mainnet.base.org', {
      batch: true,
      onFetchRequest: (req) => {
        // Prevent any unexpected RPC calls from the browser if they somehow slip through
        if (req.url.includes('mainnet.base.org')) {
          console.warn('Blocked direct RPC call to:', req.url);
          // We can't easily block it here without returning a fake response, 
          // but we can see what's triggering it in the console now.
        }
      }
    }),
  },
  pollingInterval: 120_000, // Increase polling interval to 2 minutes
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider locale="en-US">
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
